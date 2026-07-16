#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");
const os = require("os");
const http = require("http");
const https = require("https");
const { createHmac } = require("crypto");

// --- Configuration ---
const COMPONENT_DEPS_MAP = require("./component-deps.json");
const PACKAGE_ROOT = path.join(__dirname, "..");
const selfPackageJson = fs.readJsonSync(path.join(PACKAGE_ROOT, "package.json"));
const selfName = selfPackageJson.name || "lightswind";

// Source paths from the package (using original TypeScript source files)
const ALL_UI_FROM = path.join(PACKAGE_ROOT, "src", "components", "ui");
const LIB_FROM = path.join(PACKAGE_ROOT, "src", "components", "lib");
const HOOKS_FROM = path.join(PACKAGE_ROOT, "src", "components", "hooks");
const STYLES_FROM = path.join(PACKAGE_ROOT, "src", "styles", "lightswind.css");

// User's current working directory
const USER_CWD = process.cwd();

// Global set to accumulate dependencies during category or full installs
const _accumulatedDeps = new Set();

// --- API Key & Config Helpers ---
function getRcPath() {
  return path.join(os.homedir(), ".lightswindrc");
}

function readRcConfig() {
  const rcPath = getRcPath();
  if (fs.existsSync(rcPath)) {
    try {
      const raw = fs.readJsonSync(rcPath);
      // Validate key format before trusting it — must start with sk_pro_ or sk_live_
      if (raw.apiKey && !(/^sk_(pro|live)_[a-z0-9]+$/i.test(raw.apiKey))) {
        console.warn('⚠️  ~/.lightswindrc contains an invalid API key format. Ignoring.');
        raw.apiKey = null;
      }
      // Only allow our production domain or localhost for apiUrl — prevents redirect attacks
      if (raw.apiUrl) {
        const allowed = /^https:\/\/(.*\.)?lightswind\.com(:\/.*)?$|^http:\/\/localhost:\d+$/;
        if (!allowed.test(raw.apiUrl)) {
          console.warn('⚠️  ~/.lightswindrc has an unrecognized apiUrl. Falling back to default.');
          raw.apiUrl = null;
        }
      }
      return raw;
    } catch (e) {
      return {};
    }
  }
  return {};
}

function writeRcConfig(config) {
  const rcPath = getRcPath();
  try {
    fs.writeJsonSync(rcPath, config, { spaces: 2 });
    // Harden file permissions on POSIX systems (Linux / macOS)
    // chmod 600 = only the owner can read or write — no group, no others
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync(rcPath, 0o600);
      } catch (e) {
        // Non-fatal: warn but don't block the workflow
        console.warn('⚠️  Could not set secure permissions on ~/.lightswindrc:', e.message);
      }
    }
  } catch (e) {
    console.error('❌ Failed to save config to ~/.lightswindrc', e.message);
  }
}

/**
 * Read the lightswind.config.json from the user's project (or create a default one)
 */
function readLightswindConfig() {
  const configPath = path.join(USER_CWD, 'lightswind.config.json');
  if (fs.existsSync(configPath)) {
    try {
      return fs.readJsonSync(configPath);
    } catch (e) {
      return {};
    }
  }
  return {};
}

/**
 * Write lightswind.config.json back to the user's project
 */
function writeLightswindConfig(config) {
  const configPath = path.join(USER_CWD, 'lightswind.config.json');
  try {
    fs.writeJsonSync(configPath, config, { spaces: 2 });
  } catch (e) {
    console.error("❌ Failed to save config to lightswind.config.json", e.message);
  }
}


function getApiUrl() {
  return process.env.LIGHTSWIND_API_URL || readRcConfig().apiUrl || "https://pro.lightswind.com";
}

function getApiKey() {
  return process.env.LIGHTSWIND_API_KEY || readRcConfig().apiKey || null;
}

function makeRequest(url, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      if (body) {
        options.headers['Content-Length'] = Buffer.byteLength(body);
      }

      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            try {
              const err = JSON.parse(data);
              reject(new Error(err.error || err.message || `Error: ${res.statusCode}`));
            } catch (e) {
              reject(new Error(`HTTP Error ${res.statusCode}`));
            }
          }
        });
      });

      req.on('error', (e) => {
        reject(new Error(`Connection failed: ${e.message}`));
      });

      if (body) {
        req.write(body);
      }
      req.end();

    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Fire-and-forget analytics ping for batch/init installs.
 * Never blocks — errors are silently discarded.
 * Location is resolved server-side from Vercel headers (CLI sends NO user data).
 */
function trackCLIAnalytics(components, type) {
  const exitGracefully = () => {
    setTimeout(() => process.exit(0), 100);
  };

  try {
    const ts = Date.now();
    const secret = 'lightswind-cli-analytics-2026';
    const token = createHmac('sha256', secret).update(String(ts)).digest('hex');
    const body = JSON.stringify({ components, type, token, ts });

    const registryBase = process.env.LIGHTSWIND_REGISTRY_URL || 'https://lightswind.com';
    const parsedUrl = new URL(`${registryBase}/api/cli-analytics/track`);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const req = client.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'lightswind-cli/1.0',
      },
    }, () => {
      exitGracefully();
    });

    req.on('error', () => {
      exitGracefully();
    });

    req.write(body);
    req.end(() => {
      exitGracefully();
    });
  } catch (_) {
    process.exit(0);
  }
}

/**
 * Fetch the live Lightswind component registry from lightswind.com.
 * Results are cached in-memory for the duration of the CLI session.
 * Falls back gracefully if the network is unavailable.
 *
 * Registry schema: { items: [{ name, type, title, description, dependencies, files }] }
 */
let _registryCache = null;
async function fetchRegistry() {
  if (_registryCache) return _registryCache;

  const registryBase = process.env.LIGHTSWIND_REGISTRY_URL || 'https://lightswind.com';
  // Use the lightweight catalog endpoint (no file contents, just metadata)
  const url = `${registryBase}/api/registry`;

  try {
    const res = await makeRequest(url, 'GET');
    const data = JSON.parse(res);
    if (data && Array.isArray(data.items)) {
      _registryCache = data;
      return data;
    }
    throw new Error('Invalid registry format');
  } catch (e) {
    // Fallback: try the static registry.json which is served as a CDN static file
    try {
      const staticUrl = `${registryBase}/registry.json`;
      const res = await makeRequest(staticUrl, 'GET');
      const data = JSON.parse(res);
      if (data && Array.isArray(data.items)) {
        // Strip file contents from static registry to save memory (we only need metadata)
        data.items = data.items.map(item => ({
          name: item.name,
          type: item.type,
          title: item.title,
          description: item.description,
          dependencies: item.dependencies || [],
          internalDependencies: item.internalDependencies || [],
          meta: item.meta || null,
        }));
        _registryCache = data;
        return data;
      }
    } catch (_) {}
    // Return null to signal failure — callers handle graceful fallback
    return null;
  }
}

async function handleLogin(key) {
  // Validate key format locally before even hitting the network
  if (!key || !(/^sk_(pro|live)_[a-z0-9]+$/i.test(key))) {
    console.error('\n❌ Invalid key format. Keys must start with sk_pro_ or sk_live_\n');
    process.exit(1);
  }

  console.log(`\n⏳ Verifying key with ${getApiUrl()}...`);
  const url = `${getApiUrl()}/api/v1/auth/verify-license`;
  
  try {
    const res = await makeRequest(url, 'POST', JSON.stringify({ licenseKey: key }));
    const data = JSON.parse(res);

    if (!data.valid) {
      throw new Error(data.message || 'Invalid license key.');
    }

    const config = readRcConfig();
    config.apiKey = key;
    // Only persist the apiUrl if it is an approved domain (not localhost env vars)
    const currentApiUrl = getApiUrl();
    const isProduction = /^https:\/\/(.*\.)?lightswind\.com/.test(currentApiUrl);
    if (isProduction) {
      config.apiUrl = currentApiUrl;
    } else {
      // Don't persist localhost/dev URLs into the rc file — they come from env vars
      delete config.apiUrl;
    }
    writeRcConfig(config);

    if (data.terminalMessage) {
      console.log(data.terminalMessage);
    } else {
      console.log(`\n✅ Authenticated successfully as ${data.user.name} (${data.user.email})`);
      console.log(`💳 Active Plan: ${data.user.plan.toUpperCase()}`);
      console.log(`🔐 Credentials saved to ~/.lightswindrc (private to your OS user account)`);
      console.log(`🚀 You can now install Pro components using the CLI!\n`);
    }

  } catch (e) {
    console.error(`\n❌ Authentication failed: ${e.message}\n`);
    process.exit(1);
  }
}

function rewriteImports(content) {
  let changed = false;

  // Replace server paths with user component paths
  const serverPathRegex = /@\/app\/component2\/(?:ui|proui|privateui)\//g;
  if (serverPathRegex.test(content)) {
    content = content.replace(serverPathRegex, '@/components/lightswind/');
    changed = true;
  }

  // E.g., "../ui/button" -> "./button" or "../../ui/button" -> "./button"
  const relativeServerPathRegex = /from\s+["'](?:\.\.\/)+(?:ui|proui|privateui)\/([^"']+)["']/g;
  if (relativeServerPathRegex.test(content)) {
    content = content.replace(relativeServerPathRegex, 'from "./$1"');
    changed = true;
  }

  // Normalize absolute component-level references for hooks and lib to point to correct user paths
  if (content.includes('@/components/hooks/')) {
    content = content.split('@/components/hooks/').join('@/hooks/');
    changed = true;
  }
  if (content.includes('@/components/lib/')) {
    content = content.split('@/components/lib/').join('@/lib/');
    changed = true;
  }

  // Convert Next.js Image component to HTML img tags for non-Next.js frameworks
  try {
    const paths = getPaths();
    if (paths.FRAMEWORK.type !== 'nextjs') {
      if (content.includes('next/image')) {
        content = content.replace(/import\s+Image\s+from\s+["']next\/image["'];?\s*/g, '');
        content = content.replace(/<Image\s/g, '<img ');
        content = content.replace(/<\/Image>/g, '');
        changed = true;
      }
    }
  } catch (e) {}

  return content;
}

/**
 * Auto-detect internal component dependencies by parsing import statements
 */
function detectInternalDependencies(code) {
  const deps = new Set();
  
  // 1. Matches relative imports like './card' or '../../card'
  const relativeImportRegex = /from\s+["']\.\.?\/(?:\.\.?\/)*([\w-]+)["']/g;
  let match;
  while ((match = relativeImportRegex.exec(code)) !== null) {
    const compName = match[1];
    const excluded = ['utils', 'hooks', 'styles', 'react', 'lucide-react', 'framer-motion', 'next', 'index', 'db', 'app'];
    if (!excluded.includes(compName) && !compName.startsWith('use-')) {
      deps.add(compName);
    }
  }

  // 2. Matches absolute alias imports like '@/components/lightswind/card'
  const aliasImportRegex = /from\s+["']@\/?components\/lightswind\/([\w-]+)["']/g;
  while ((match = aliasImportRegex.exec(code)) !== null) {
    const compName = match[1];
    deps.add(compName);
  }

  return Array.from(deps);
}

/**
 * Auto-detect external NPM dependencies by parsing import statements
 */
function detectExternalDependencies(code) {
  const deps = new Set();
  
  const importRegex = /from\s+["']([^"']+)["']/g;
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1];
    
    if (
      importPath.startsWith('.') || 
      importPath.startsWith('@/') || 
      importPath.startsWith('@components/')
    ) {
      continue;
    }
    
    let pkgName;
    if (importPath.startsWith('@')) {
      const parts = importPath.split('/');
      pkgName = parts.slice(0, 2).join('/');
    } else {
      pkgName = importPath.split('/')[0];
    }
    
    const excluded = [
      'react', 'react-dom', 'next', 'path', 'fs', 'os', 'child_process', 'typescript'
    ];
    
    if (pkgName && !excluded.includes(pkgName)) {
      deps.add(pkgName);
    }
  }
  
  return Array.from(deps);
}


// --- Helper Functions ---

/**
 * Read user's package.json.
 * Walks up the directory tree (like npm does) to find the nearest package.json.
 */
let PROJECT_ROOT = USER_CWD; // resolved project root — updated by readUserPackageJson()

function readUserPackageJson() {
  let dir = USER_CWD;
  const root = path.parse(dir).root;

  for (let i = 0; i < 8; i++) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      if (dir !== USER_CWD) {
        console.log(`ℹ️  No package.json in current directory — using project root: ${dir}`);
      }
      PROJECT_ROOT = dir; // update global so getPaths() / detectComponentsPath() use the right root
      return fs.readJsonSync(pkgPath);
    }
    const parent = path.dirname(dir);
    if (parent === dir || parent === root) break; // reached filesystem root
    dir = parent;
  }

  console.error(`❌ No package.json found in "${USER_CWD}" or any parent directory.`);
  console.error('   Run this command from your project root — the folder that contains package.json.');
  console.error('   Example: cd my-app && npx lightswind add animated-tooltip');
  process.exit(1);
}

/**
 * Detect the framework being used
 */
function detectFramework(packageJson) {
  const deps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
  };

  if (deps['next']) return { name: 'Next.js', type: 'nextjs' };
  if (deps['vite']) return { name: 'Vite', type: 'vite' };
  if (deps['react-scripts']) return { name: 'Create React App', type: 'cra' };

  return { name: 'React', type: 'react' };
}

/**
 * Detect the best components directory for this project
 */
function detectComponentsPath() {
  // Ensure PROJECT_ROOT is resolved by loading package.json (if not done yet)
  readUserPackageJson();

  // Check existing directories first
  const possiblePaths = [
    path.join(PROJECT_ROOT, 'src', 'components'),
    path.join(PROJECT_ROOT, 'components'),
    path.join(PROJECT_ROOT, 'app', 'components'),
  ];

  // Return first existing path
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return {
        components: p,
        lib: path.join(path.dirname(p), 'lib'),
        hooks: path.join(path.dirname(p), 'hooks'),
        styles: path.join(path.dirname(p), 'lightswind.css'),
        framework: null // Will be set by caller
      };
    }
  }

  // No existing components directory, choose based on framework
  const packageJson = readUserPackageJson();
  const framework = detectFramework(packageJson);

  let basePath;

  if (framework.type === 'nextjs') {
    // Check if Next.js uses src/ directory
    const hasSrc = fs.existsSync(path.join(PROJECT_ROOT, 'src'));
    basePath = hasSrc
      ? path.join(PROJECT_ROOT, 'src', 'components')
      : path.join(PROJECT_ROOT, 'components');
  } else {
    // Vite, CRA, generic React - use src/components
    basePath = path.join(PROJECT_ROOT, 'src', 'components');
  }

  return {
    components: basePath,
    lib: path.join(path.dirname(basePath), 'lib'),
    hooks: path.join(path.dirname(basePath), 'hooks'),
    styles: path.join(path.dirname(basePath), 'lightswind.css'),
    framework: framework
  };
}

/**
 * Get all destination paths for the current project
 */
function getPaths() {
  const detected = detectComponentsPath();
  const packageJson = readUserPackageJson();
  const framework = detected.framework || detectFramework(packageJson);

  return {
    ALL_UI_TO: path.join(detected.components, 'lightswind'),
    LIB_TO: detected.lib,
    HOOKS_TO: detected.hooks,
    STYLES_TO: detected.styles,
    COMPONENTS_DIR: detected.components,
    FRAMEWORK: framework
  };
}

/**
 * Get missing dependencies
 */
function getMissingDependencies(required, userPkg) {
  const installed = {
    ...(userPkg.dependencies || {}),
    ...(userPkg.devDependencies || {})
  };

  // Always enforce core baseline dependencies
  const coreDeps = ["clsx", "tailwind-merge", "class-variance-authority", "lucide-react"];
  coreDeps.forEach(dep => {
    if (!installed[dep] && !required.includes(dep)) {
      required.push(dep);
    }
  });

  const selfName = require("../package.json").name || "lightswind";
  const hasCore = installed["lightswind"] || installed["lightswind-test"];
  if (!hasCore && !required.includes("lightswind") && !required.includes("lightswind-test")) {
    required.push(selfName);
  }

  // Filter out any invalid dependency names like AnimationType
  const invalidDeps = ["AnimationType"];
  required = required.filter(dep => !invalidDeps.includes(dep));

  return required.filter(dep => !installed[dep]);
}


/**
 * Prompt user for yes/no input
 */
function promptUser(question) {
  if (process.argv.includes('--yes') || process.argv.includes('-y')) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, (answer) => {
      rl.close();
      const normalized = answer.toLowerCase().trim();
      resolve(normalized === 'y' || normalized === 'yes' || normalized === '');
    });
  });
}

/**
 * Detect the package manager based on user agent or lockfiles
 */
function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("yarn")) return "yarn";
  if (userAgent.includes("bun")) return "bun";

  try {
    if (fs.existsSync(path.join(PROJECT_ROOT, "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(PROJECT_ROOT, "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(PROJECT_ROOT, "bun.lockb")) || fs.existsSync(path.join(PROJECT_ROOT, "bun.lock"))) return "bun";
  } catch (e) {}

  return "npm";
}

/**
 * Install npm dependencies
 */
function installDependencies(deps) {
  if (deps.length === 0) return;

  const pm = detectPackageManager();
  console.log(`\n⏳ Installing ${deps.join(", ")} using ${pm}...`);

  let cmd;
  switch (pm) {
    case "pnpm":
      cmd = `pnpm add ${deps.join(" ")}`;
      break;
    case "yarn":
      cmd = `yarn add ${deps.join(" ")}`;
      break;
    case "bun": {
      let bunCmd = "bun";
      try {
        execSync("bun --version", { stdio: "ignore" });
      } catch (e) {
        const home = os.homedir();
        const winPath = path.join(home, ".bun", "bin", "bun.exe");
        const unixPath = path.join(home, ".bun", "bin", "bun");
        if (fs.existsSync(winPath)) {
          bunCmd = `"${winPath}"`;
        } else if (fs.existsSync(unixPath)) {
          bunCmd = `"${unixPath}"`;
        }
      }
      cmd = `${bunCmd} add ${deps.join(" ")}`;
      break;
    }
    case "npm":
    default:
      cmd = `npm install ${deps.join(" ")}`;
      break;
  }

  try {
    execSync(cmd, { stdio: "inherit", cwd: USER_CWD });
    console.log("✅ Dependencies installed successfully\n");
  } catch (error) {
    console.error(`❌ Failed to install dependencies using ${pm}`);
    console.error("💡 Try installing them manually:");
    console.error(`   ${pm === "npm" ? "npm install" : pm + " add"} ${deps.join(" ")}`);
  }
}

/**
 * Prompt user for initial theme configuration
 */
async function promptAndApplyTheme(stylesPath) {
  console.log("\n🎨 Choose a primary color theme for your project (You can always change this later in lightswind.css):");
  console.log("  1) Default (Blue)  - Professional and clean");
  console.log("  2) Deep Ocean      - Darker sleek blue/purple");
  console.log("  3) Crimson         - Vibrant red/rose");
  console.log("  4) Emerald         - Crisp green");
  console.log("  5) Amber           - Warm orange/yellow");
  console.log("  6) Amethyst        - Rich purple");
  console.log("  7) Monospace       - Black & white minimal\n");
  
  const choice = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Select a theme (1-7) [Default: 1]: ", (answer) => {
      rl.close();
      resolve(answer.trim() || '1');
    });
  });
  
  const themes = {
    '1': { name: 'Default', primarylw: '#173eff', primarylw2: '#3758f9' },
    '2': { name: 'Deep Ocean', primarylw: '#0ea5e9', primarylw2: '#38bdf8' },
    '3': { name: 'Crimson', primarylw: '#e11d48', primarylw2: '#fb7185' },
    '4': { name: 'Emerald', primarylw: '#10b981', primarylw2: '#34d399' },
    '5': { name: 'Amber', primarylw: '#f59e0b', primarylw2: '#fbbf24' },
    '6': { name: 'Amethyst', primarylw: '#8b5cf6', primarylw2: '#a78bfa' },
    '7': { name: 'Monospace', primarylw: '#000000', primarylw2: '#333333' }
  };
  
  const selectedTheme = themes[choice] || themes['1'];
  console.log(`\n✨ Applying ${selectedTheme.name} theme...`);
  
  let content = fs.readFileSync(stylesPath, 'utf8');
  
  // Replace in :root and .dark blocks
  content = content.replace(/(:root\s*{[^}]*--primarylw:\s*)#[0-9a-fA-F]+;/g, `$1${selectedTheme.primarylw};`);
  content = content.replace(/(:root\s*{[^}]*--primarylw-2:\s*)#[0-9a-fA-F]+;/g, `$1${selectedTheme.primarylw2};`);
  
  if (choice === '7') {
    // Monospace specific: dark mode should be white
    content = content.replace(/(\.dark\s*{[^}]*--primarylw:\s*)#[0-9a-fA-F]+;/g, `$1#ffffff;`);
    content = content.replace(/(\.dark\s*{[^}]*--primarylw-2:\s*)#[0-9a-fA-F]+;/g, `$1#cccccc;`);
  } else {
    // Normal dark mode same as light mode
    content = content.replace(/(\.dark\s*{[^}]*--primarylw:\s*)#[0-9a-fA-F]+;/g, `$1${selectedTheme.primarylw};`);
    content = content.replace(/(\.dark\s*{[^}]*--primarylw-2:\s*)#[0-9a-fA-F]+;/g, `$1${selectedTheme.primarylw2};`);
  }
  
  fs.writeFileSync(stylesPath, content, 'utf8');
  console.log(`✅ ${selectedTheme.name} theme applied successfully.`);
}

/**
 * Copy shared utilities (lib, hooks, styles)
 */
async function copySharedUtils() {
  const paths = getPaths();
  let utilsInstalled = false;
  let isNewStylesFile = false;

  // Preserve existing theme before overwriting styles file
  let existingPrimaryLw = null;
  let existingPrimaryLw2 = null;
  let existingDarkPrimaryLw = null;
  let existingDarkPrimaryLw2 = null;

  if (fs.existsSync(paths.STYLES_TO)) {
    try {
      const existingContent = fs.readFileSync(paths.STYLES_TO, 'utf8');
      
      // Extract from :root
      const rootMatch = existingContent.match(/:root\s*{([^}]*)}/);
      if (rootMatch) {
        const rootContent = rootMatch[1];
        const p1 = rootContent.match(/--primarylw:\s*(#[0-9a-fA-F]+);/);
        const p2 = rootContent.match(/--primarylw-2:\s*(#[0-9a-fA-F]+);/);
        if (p1) existingPrimaryLw = p1[1];
        if (p2) existingPrimaryLw2 = p2[1];
      }
      
      // Extract from .dark
      const darkMatch = existingContent.match(/\.dark\s*{([^}]*)}/);
      if (darkMatch) {
         const darkContent = darkMatch[1];
         const dp1 = darkContent.match(/--primarylw:\s*(#[0-9a-fA-F]+);/);
         const dp2 = darkContent.match(/--primarylw-2:\s*(#[0-9a-fA-F]+);/);
         if (dp1) existingDarkPrimaryLw = dp1[1];
         if (dp2) existingDarkPrimaryLw2 = dp2[1];
      }
    } catch(e) {}
  } else {
    isNewStylesFile = true;
  }

  // Copy lib folder
  if (fs.existsSync(LIB_FROM)) {
    fs.ensureDirSync(paths.LIB_TO);
    fs.copySync(LIB_FROM, paths.LIB_TO, { overwrite: true });
    utilsInstalled = true;
  }

  // Copy hooks folder
  if (fs.existsSync(HOOKS_FROM)) {
    fs.ensureDirSync(paths.HOOKS_TO);
    fs.copySync(HOOKS_FROM, paths.HOOKS_TO, { overwrite: true });
    utilsInstalled = true;
  }

  // Copy styles file
  if (fs.existsSync(STYLES_FROM)) {
    fs.ensureDirSync(path.dirname(paths.STYLES_TO));
    fs.copySync(STYLES_FROM, paths.STYLES_TO, { overwrite: true });
    utilsInstalled = true;

    // Restore existing theme if it wasn't a new file
    if (!isNewStylesFile && existingPrimaryLw) {
      let content = fs.readFileSync(paths.STYLES_TO, 'utf8');
      content = content.replace(/(:root\s*{[^}]*--primarylw:\s*)#[0-9a-fA-F]+;/g, `$1${existingPrimaryLw};`);
      if (existingPrimaryLw2) {
        content = content.replace(/(:root\s*{[^}]*--primarylw-2:\s*)#[0-9a-fA-F]+;/g, `$1${existingPrimaryLw2};`);
      }
      if (existingDarkPrimaryLw) {
         content = content.replace(/(\.dark\s*{[^}]*--primarylw:\s*)#[0-9a-fA-F]+;/g, `$1${existingDarkPrimaryLw};`);
      }
      if (existingDarkPrimaryLw2) {
         content = content.replace(/(\.dark\s*{[^}]*--primarylw-2:\s*)#[0-9a-fA-F]+;/g, `$1${existingDarkPrimaryLw2};`);
      }
      fs.writeFileSync(paths.STYLES_TO, content, 'utf8');
    }
  }

  if (utilsInstalled) {
    console.log("✅ Installed shared utilities (lib, hooks, styles)");
  }

  // If this is a new CSS file install, prompt for the theme
  if (isNewStylesFile && fs.existsSync(paths.STYLES_TO)) {
    await promptAndApplyTheme(paths.STYLES_TO);
  }

  // Auto-configure path alias mappings if needed
  configureTsConfigAlias();
  configureViteConfigAlias();
}

/**
 * Auto-configure import aliases (@/* -> ./src/*) in tsconfig.json / tsconfig.app.json if missing
 */
function configureTsConfigAlias() {
  const possibleTsConfigs = ['tsconfig.app.json', 'tsconfig.json'];
  let configPath = null;
  for (const config of possibleTsConfigs) {
    const fullPath = path.join(USER_CWD, config);
    if (fs.existsSync(fullPath)) {
      configPath = fullPath;
      break;
    }
  }

  if (!configPath) return;

  try {
    let content = fs.readFileSync(configPath, 'utf8');
    if (content.includes('"@/*"') || content.includes("'@/*'")) {
      return; // Already configured
    }

    const compilerOptionsRegex = /"compilerOptions"\s*:\s*\{/;
    if (compilerOptionsRegex.test(content)) {
      content = content.replace(
        compilerOptionsRegex,
        `"compilerOptions": {\n    "paths": {\n      "@/*": ["./src/*"]\n    },`
      );
      fs.writeFileSync(configPath, content, 'utf8');
      console.log(`✅ Configured import alias "@/*" in ${path.basename(configPath)}`);
    }
  } catch (e) {
    // Fail silently
  }
}

/**
 * Auto-configure import aliases (@ -> ./src) in vite.config.ts / vite.config.js if missing
 */
function configureViteConfigAlias() {
  const possibleViteConfigs = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs'];
  let configPath = null;
  for (const config of possibleViteConfigs) {
    const fullPath = path.join(USER_CWD, config);
    if (fs.existsSync(fullPath)) {
      configPath = fullPath;
      break;
    }
  }

  if (!configPath) return;

  try {
    let content = fs.readFileSync(configPath, 'utf8');
    if (content.includes('"@"') || content.includes("'@'") || content.includes('path.resolve')) {
      return; // Already configured
    }

    if (!content.includes("import path from 'path'") && !content.includes('import path from "path"')) {
      content = "import path from 'path'\n" + content;
    }

    if (content.includes('resolve:')) {
      content = content.replace(/resolve\s*:\s*\{/, `resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },`);
    } else {
      const defineConfigRegex = /defineConfig\(\{\s*/;
      if (defineConfigRegex.test(content)) {
        content = content.replace(
          defineConfigRegex,
          `defineConfig({\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },\n  },\n`
        );
      }
    }
    fs.writeFileSync(configPath, content, 'utf8');
    console.log(`✅ Configured import alias "@" in ${path.basename(configPath)}`);
  } catch (e) {
    // Fail silently
  }
}

/**
 * Copy a single component
 */
function copyComponent(componentName) {
  const paths = getPaths();
  const fileName = `${componentName}.tsx`;
  const fromPath = path.join(ALL_UI_FROM, fileName);
  const toPath = path.join(paths.ALL_UI_TO, fileName);

  if (!fs.existsSync(fromPath)) {
    return false;
  }

  fs.ensureDirSync(path.dirname(toPath));
  fs.copySync(fromPath, toPath, { overwrite: true });

  // Rewrite any @/ or internal Next.js imports to correct relative paths
  try {
    let content = fs.readFileSync(toPath, 'utf8');
    content = rewriteImports(content);
    fs.writeFileSync(toPath, content, 'utf8');
  } catch (e) {
    // Non-critical, skip silently
  }

  return true;
}


/**
 * Detect Tailwind CSS version
 */
function detectTailwindVersion() {
  try {
    const userPkg = readUserPackageJson();
    const deps = {
      ...(userPkg.dependencies || {}),
      ...(userPkg.devDependencies || {})
    };

    const tailwindVersion = deps['tailwindcss'];
    if (!tailwindVersion) {
      return null;
    }

    const versionMatch = tailwindVersion.match(/(\d+)/);
    if (versionMatch) {
      return parseInt(versionMatch[1]);
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Find Tailwind config file
 */
function findTailwindConfig() {
  const possibleConfigs = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.mjs',
    'tailwind.config.cjs'
  ];

  for (const config of possibleConfigs) {
    const configPath = path.join(USER_CWD, config);
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

/**
 * Find main CSS file (for Tailwind v4)
 */
function findMainCSSFile() {
  const possiblePaths = [
    'src/app/globals.css',
    'src/globals.css',
    'app/globals.css',
    'src/styles/globals.css',
    'src/index.css',
    'src/App.css',
    'styles/globals.css'
  ];

  for (const cssPath of possiblePaths) {
    const fullPath = path.join(USER_CWD, cssPath);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  const srcDir = path.join(USER_CWD, 'src');
  if (fs.existsSync(srcDir)) {
    try {
      const files = fs.readdirSync(srcDir);
      const priorityNames = ['index.css', 'style.css', 'main.css', 'app.css'];
      for (const file of files) {
        if (priorityNames.includes(file.toLowerCase())) {
          return path.join(srcDir, file);
        }
      }
      for (const file of files) {
        if (file.endsWith('.css')) {
          return path.join(srcDir, file);
        }
      }
    } catch (e) {}
  }

  return null;
}

/**
 * Configure Tailwind plugin for v3 (tailwind.config.js)
 */
function configureTailwindV3Plugin() {
  const configPath = findTailwindConfig();

  if (!configPath) {
    console.log("\n⚠️  Tailwind config not found");
    console.log("💡 Add Lightswind plugin manually to tailwind.config.js:");
    console.log("   plugins: [require('lightswind/plugin')]");
    return false;
  }

  try {
    let content = fs.readFileSync(configPath, 'utf-8');

    if (content.includes("lightswind/plugin")) {
      console.log("✅ Lightswind plugin already in tailwind.config");
      return true;
    }

    if (content.includes('plugins:')) {
      content = content.replace(
        /plugins:\s*\[/,
        "plugins: [\n    require('lightswind/plugin'),"
      );
    } else {
      content = content.replace(
        /module\.exports\s*=\s*{/,
        "module.exports = {\n  plugins: [require('lightswind/plugin')],"
      );
    }

    fs.writeFileSync(configPath, content, 'utf-8');
    console.log("✅ Added Lightswind plugin to tailwind.config");
    return true;
  } catch (error) {
    console.log("\n⚠️  Could not auto-configure Tailwind plugin");
    console.log("💡 Add manually to tailwind.config.js:");
    console.log("   plugins: [require('lightswind/plugin')]");
    return false;
  }
}

/**
 * Configure Tailwind plugin for v4 (CSS file)
 */
function configureTailwindV4Plugin() {
  const cssPath = findMainCSSFile();

  if (!cssPath) {
    console.log("\n⚠️  Main CSS file not found");
    console.log("💡 Add Lightswind plugin manually to your CSS file:");
    console.log("   @import 'tailwindcss';");
    console.log("   @plugin 'lightswind/plugin';");
    return false;
  }

  try {
    let content = fs.readFileSync(cssPath, 'utf-8');

    if (content.includes("lightswind/plugin")) {
      console.log("✅ Lightswind plugin already in CSS");
      return true;
    }

    if (content.includes("@import 'tailwindcss'") || content.includes('@import "tailwindcss"')) {
      content = content.replace(
        /@import ['"]tailwindcss['"];?\s*/,
        "@import 'tailwindcss';\n@plugin 'lightswind/plugin';\n"
      );
    } else {
      content = "@import 'tailwindcss';\n@plugin 'lightswind/plugin';\n\n" + content;
    }

    fs.writeFileSync(cssPath, content, 'utf-8');
    console.log(`✅ Added Lightswind plugin to ${path.basename(cssPath)}`);
    return true;
  } catch (error) {
    console.log("\n⚠️  Could not auto-configure Tailwind plugin");
    console.log("💡 Add manually to your main CSS file:");
    console.log("   @plugin 'lightswind/plugin';");
    return false;
  }
}

/**
 * Auto-configure Tailwind plugin based on version
 */
function autoConfigureTailwindPlugin() {
  const tailwindVersion = detectTailwindVersion();

  if (!tailwindVersion) {
    console.log("\n⚠️  Tailwind CSS not found in package.json");
    console.log("💡 Install Tailwind CSS first:");
    console.log("   npm install -D tailwindcss");
    return;
  }

  console.log(`\n🔧 Configuring Lightswind for Tailwind CSS v${tailwindVersion}...`);

  if (tailwindVersion >= 4) {
    if (!configureTailwindV4Plugin()) {
      appendCssFallback();
    }
  } else {
    if (!configureTailwindV3Plugin()) {
      appendCssFallback();
    }
  }
}

/**
 * Append Lightswind CSS content to main CSS file as fallback
 */
function appendCssFallback() {
  console.log("\n⚠️  Falling back to manual CSS injection...");

  const cssPath = findMainCSSFile();
  if (!cssPath) {
    console.error("❌ Could not find main CSS file to inject styles.");
    return;
  }

  const paths = getPaths();
  const stylesPath = paths.STYLES_TO;

  if (!fs.existsSync(stylesPath)) {
    console.error("❌ Could not find source styles file.");
    return;
  }

  try {
    const stylesContent = fs.readFileSync(stylesPath, 'utf-8');
    let mainCssContent = fs.readFileSync(cssPath, 'utf-8');

    if (mainCssContent.includes("/* lightswind.css */")) {
      console.log("✅ Lightswind styles already present in CSS");
      return;
    }

    mainCssContent += "\n\n/* lightswind.css */\n" + stylesContent;

    fs.writeFileSync(cssPath, mainCssContent, 'utf-8');
    console.log(`✅ Appended Lightswind styles to ${path.basename(cssPath)}`);

  } catch (error) {
    console.error("❌ Failed to append styles:", error.message);
  }
}

// --- Theme and Shading Helpers ---

function applyTheme(themeIndex) {
  const themes = {
    1: { name: "Default (Blue)", light: { primary: "#173eff", primary2: "#3758f9" }, dark: { primary: "#173eff", primary2: "#3758f9" } },
    2: { name: "Deep Ocean", light: { primary: "#0f172a", primary2: "#3b82f6" }, dark: { primary: "#3b82f6", primary2: "#60a5fa" } },
    3: { name: "Crimson", light: { primary: "#e11d48", primary2: "#fb7185" }, dark: { primary: "#e11d48", primary2: "#fb7185" } },
    4: { name: "Emerald", light: { primary: "#059669", primary2: "#34d399" }, dark: { primary: "#059669", primary2: "#34d399" } },
    5: { name: "Amber", light: { primary: "#d97706", primary2: "#fbbf24" }, dark: { primary: "#d97706", primary2: "#fbbf24" } },
    6: { name: "Amethyst", light: { primary: "#7c3aed", primary2: "#a78bfa" }, dark: { primary: "#7c3aed", primary2: "#a78bfa" } },
    7: { name: "Monospace", light: { primary: "#000000", primary2: "#404040" }, dark: { primary: "#ffffff", primary2: "#a3a3a3" } }
  };

  const selected = themes[themeIndex] || themes[1];
  console.log(`\n✨ Applying ${selected.name} theme...`);

  const paths = getPaths();
  const cssPath = paths.STYLES_TO;

  if (!fs.existsSync(cssPath)) {
    console.error("❌ Could not find lightswind.css in your project. Please run init first.");
    return;
  }

  try {
    let content = fs.readFileSync(cssPath, 'utf8');

    // Replace in :root
    const rootMatch = content.match(/:root\s*\{[^}]*\}/);
    if (rootMatch) {
      let rootBlock = rootMatch[0];
      rootBlock = rootBlock.replace(/--primarylw:\s*[^;]+;/, `--primarylw: ${selected.light.primary};`);
      rootBlock = rootBlock.replace(/--primarylw-2:\s*[^;]+;/, `--primarylw-2: ${selected.light.primary2};`);
      content = content.replace(rootMatch[0], rootBlock);
    }

    // Replace in .dark
    const darkMatch = content.match(/\.dark\s*\{[^}]*\}/);
    if (darkMatch) {
      let darkBlock = darkMatch[0];
      darkBlock = darkBlock.replace(/--primarylw:\s*[^;]+;/, `--primarylw: ${selected.dark.primary};`);
      darkBlock = darkBlock.replace(/--primarylw-2:\s*[^;]+;/, `--primarylw-2: ${selected.dark.primary2};`);
      content = content.replace(darkMatch[0], darkBlock);
    }

    fs.writeFileSync(cssPath, content, 'utf8');
    console.log(`✅ Theme applied. Update anytime in ${path.basename(cssPath)}`);

  } catch (e) {
    console.error("❌ Failed to apply color theme:", e.message);
  }
}

async function runThemeSetup() {
  console.log("\n🎨 Choose a primary color theme for your project:");
  console.log("1) Default (Blue) - Professional and clean");
  console.log("2) Deep Ocean - Darker sleek blue/purple");
  console.log("3) Crimson - Vibrant red/rose");
  console.log("4) Emerald - Crisp green");
  console.log("5) Amber - Warm orange");
  console.log("6) Amethyst - Rich purple");
  console.log("7) Monospace - Black & white");
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("\nSelect a theme (1-7) [Default: 1]: ", (answer) => {
      rl.close();
      const choice = parseInt(answer.trim()) || 1;
      applyTheme(choice);
      resolve();
    });
  });
}

function toggle3D(status) {
  const on = status.toLowerCase() === 'on';
  console.log(`\n🔧 Toggling 3D Shade Effect to: ${on ? 'ON' : 'OFF'}...`);
  
  // Save to lightswind.config.json for reference
  const config = readLightswindConfig();
  config.effect3d = on;
  writeLightswindConfig(config);
  
  const tailwindVersion = detectTailwindVersion();
  
  if (tailwindVersion >= 4) {
    const cssPath = findMainCSSFile();
    if (!cssPath) {
      console.error("❌ Could not find main CSS file to configure 3D effect.");
      return;
    }
    
    try {
      let content = fs.readFileSync(cssPath, 'utf-8');
      if (on) {
        content = content.replace(/@plugin\s+['"]lightswind\/plugin['"]\s*;?/g, "@plugin 'lightswind/plugin' { effect3d: true };");
      } else {
        content = content.replace(/@plugin\s+['"]lightswind\/plugin['"]\s*\{\s*effect3d\s*:\s*true\s*\}\s*;?/g, "@plugin 'lightswind/plugin';");
      }
      fs.writeFileSync(cssPath, content, 'utf-8');
      console.log(`✅ 3D Shade configuration updated in ${path.basename(cssPath)}`);
    } catch (e) {
      console.error("❌ Failed to update 3D configuration in CSS file:", e.message);
    }
  } else {
    const configPath = findTailwindConfig();
    if (!configPath) {
      console.error("❌ Could not find tailwind.config file to configure 3D effect.");
      return;
    }
    
    try {
      let content = fs.readFileSync(configPath, 'utf-8');
      if (on) {
        content = content.replace(/require\(['"]lightswind\/plugin['"]\)/g, "require('lightswind/plugin')({ effect3d: true })");
      } else {
        content = content.replace(/require\(['"]lightswind\/plugin['"]\)\(\{\s*effect3d\s*:\s*true\s*\}\)/g, "require('lightswind/plugin')");
      }
      fs.writeFileSync(configPath, content, 'utf-8');
      console.log(`✅ 3D Shade configuration updated in ${path.basename(configPath)}`);
    } catch (e) {
      console.error("❌ Failed to update 3D configuration in tailwind.config:", e.message);
    }
  }
  
  console.log("💡 Please restart your dev server (npm run dev) to apply changes.\n");
}

/**
 * Helper to normalize and match category input, supporting aliases and meta-categories.
 */
function getCategoryKey(name) {
  if (!name) return null;
  const norm = name.toLowerCase().trim().replace(/[-_\s]+/g, "");
  
  if (norm === "utility" || norm === "utilities") return "utility";
  if (norm === "background" || norm === "backgrounds") return "background";
  if (norm === "button" || norm === "buttons" || norm === "animatedbutton" || norm === "animatedbuttons") return "button";
  if (norm === "text" || norm === "texts" || norm === "animatedtext" || norm === "animatedtexts") return "text";
  if (norm === "3d" || norm === "3delements" || norm === "3d-elements" || norm === "threedelements") return "3d";
  if (norm === "cursor" || norm === "cursors" || norm === "animatedcursor" || norm === "animatedcursors") return "cursor";
  if (norm === "components" || norm === "component" || norm === "animatedcomponents") return "components";
  if (norm === "layout" || norm === "layouts") return "layout";
  if (norm === "ui" || norm === "uielements" || norm === "ui-elements" || norm === "uielement") return "ui";
  if (norm === "form" || norm === "forms" || norm === "formcontrol" || norm === "formcontrols" || norm === "form-controls") return "form";
  if (norm === "navigation" || norm === "navigations") return "navigation";
  
  if (norm === "professional" || norm === "pro") return "professional";
  if (norm === "animated" || norm === "animation" || norm === "animations") return "animated";
  
  return null;
}


function generateCursorRules() {
  const content = `{
  "rules": [
    "Always import Lightswind UI components from '@/components/lightswind/<component-name>' (or your customized components path).",
    "Lightswind UI variables and tokens are defined in 'src/components/lightswind.css'. Make sure to use standard tokens like '--primarylw' (primary brand) and '--greedy' (accent color).",
    "For color classes, use custom utilities like 'text-primarylw', 'bg-primarylw', 'text-greedy', and 'bg-greedy'.",
    "Do not import CSS files for individual components; the global 'lightswind.css' file contains all required component styles.",
    "If components require Framer Motion, GSAP, or Lucide Icons, ensure those packages are installed. The CLI ('npx lightswind add') installs them automatically.",
    "To toggle 3D depth and bevel shading globally across components, run the command 'npx lightswind effect3d on' or 'npx lightswind effect3d off' to update the Tailwind plugin configuration.",
    "To customize colors, edit the primary HSL and hex variables inside 'lightswind.css'."
  ]
}
`;

  try {
    fs.writeFileSync(path.join(USER_CWD, ".cursorrules"), content, "utf8");
    fs.writeFileSync(path.join(USER_CWD, ".windsurfrules"), content, "utf8");
    console.log("✅ Generated .cursorrules file successfully");
    console.log("✅ Generated .windsurfrules file successfully");
  } catch (e) {
    console.error("❌ Failed to generate agent rules:", e.message);
  }
}

// --- Commands ---

/**
 * Install all components
 * Fetches the full component list from the live website registry.
 * New components added to lightswind.com automatically appear here without npm updates.
 */
async function installAll(filter = null) {
  const paths = getPaths();

  let title = "all Lightswind components";
  let targetComponents = [];

  console.log(`\n⏳ Fetching component list from Lightswind registry...`);
  const registry = await fetchRegistry();

  if (registry && registry.items && registry.items.length > 0) {
    // Use live registry: group by category filter
    let items = registry.items.filter(item => !item.meta?.paid); // Only free components in init

    if (filter === 'professional') {
      title = "all Professional Lightswind components";
      const proCats = ['utility', 'layout', 'ui', 'form', 'navigation'];
      items = items.filter(item => proCats.includes(item.meta?.category));
    } else if (filter === 'animated') {
      title = "all Animated Lightswind components";
      const animCats = ['utility', 'background', 'button', '3d', 'cursor', 'text', 'components'];
      items = items.filter(item => animCats.includes(item.meta?.category));
    }

    targetComponents = [...new Set(items.map(item => item.name))];
    console.log(`✅ Found ${targetComponents.length} components in live registry`);
  } else {
    // Fallback: use local COMPONENT_DEPS_MAP if registry is unreachable
    console.log(`⚠️  Could not reach registry. Installing from local package...`);
    const groups = groupComponentsByCategory();
    if (filter === 'professional') {
      title = "all Professional Lightswind components";
      const proCats = ['utility', 'layout', 'ui', 'form', 'navigation'];
      proCats.forEach(cat => {
        if (groups[cat]) targetComponents.push(...groups[cat].components);
      });
    } else if (filter === 'animated') {
      title = "all Animated Lightswind components";
      const animCats = ['utility', 'background', 'button', '3d', 'cursor', 'text', 'components'];
      animCats.forEach(cat => {
        if (groups[cat]) targetComponents.push(...groups[cat].components);
      });
    } else {
      Object.values(groups).forEach(cat => targetComponents.push(...cat.components));
    }
    targetComponents = [...new Set(targetComponents)];
  }

  if (targetComponents.length === 0) {
    console.error(`❌ No components found. Please check your internet connection and try again.`);
    process.exit(1);
  }

  _accumulatedDeps.clear();

  console.log(`\n🚀 Installing ${title}...`);
  console.log(`📦 Detected: ${paths.FRAMEWORK.name}`);
  console.log(`📁 Installing to: ${paths.ALL_UI_TO}\n`);

  // Install components (each one fetches from CDN via installComponent)
  let installedCount = 0;
  const visited = new Set();
  for (const comp of targetComponents) {
    await installComponent(comp, visited, true);
    installedCount++;
  }

  // Batch install all accumulated dependencies at the very end
  if (_accumulatedDeps.size > 0) {
    const userPkg = readUserPackageJson();
    const finalDeps = getMissingDependencies([..._accumulatedDeps], userPkg);
    if (finalDeps.length > 0) {
      console.log(`📦 Components require the following external packages: ${finalDeps.join(", ")}`);
      const shouldInstall = await promptUser("Install these dependencies now? (Y/n): ");
      if (shouldInstall) {
        installDependencies(finalDeps);
      } else {
        console.log("⚠️  Skipping dependency installation. You must install them manually.");
      }
    }
  }

  // Copy shared utilities
  await copySharedUtils();

  // Auto-configure Tailwind plugin
  autoConfigureTailwindPlugin();

  console.log(`\n🎉 Success! ${installedCount} Lightswind components installed.`);
  console.log("\nNext steps:");
  console.log("  1. Import components: import { Button } from '@/components/lightswind/button'");
  console.log("  2. Start building! 🚀\n");

  // Fire-and-forget analytics ping (never blocks, never fails)
  const type = filter === 'professional' ? 'init-professional' : filter === 'animated' ? 'init-animated' : 'init-all';
  trackCLIAnalytics(targetComponents, type);
}


/**
 * Install a specific component
 */
async function installComponent(componentName, visited = new Set(), isCategoryInstall = false) {
  if (!componentName) {
    console.error("❌ Please specify a component name");
    console.error("Usage: npx lightswind@latest add <component-name>");
    console.error("Example: npx lightswind@latest add button\n");
    process.exit(1);
  }

  // Prevent infinite loops on recursive installs
  if (visited.has(componentName)) return;
  const isRoot = visited.size === 0;
  visited.add(componentName);

  const paths = getPaths();
  const componentFile = `${componentName}.tsx`;
  const fromPath = path.join(ALL_UI_FROM, componentFile);
  const localSourceExists = fs.existsSync(fromPath);

  if (isRoot && !isCategoryInstall) {
    console.log(`\n📦 Installing ${componentName}...`);
    console.log(`📦 Detected: ${paths.FRAMEWORK.name}`);
    console.log(`📁 Installing to: ${paths.ALL_UI_TO}\n`);
  }

  let installedFromCdn = false;
  let data = null;

  // Check pre-fetched registry cache first (highly optimized for category/all installs)
  if (_registryCache && Array.isArray(_registryCache.items)) {
    const cachedItem = _registryCache.items.find(item => item.name.toLowerCase() === componentName.toLowerCase());
    if (cachedItem && cachedItem.files && cachedItem.files.length > 0) {
      data = cachedItem;
    }
  }

  try {
    if (!data) {
      console.log(`⏳ Fetching '${componentName}' from Lightswind registry...`);
      const registryBase = process.env.LIGHTSWIND_REGISTRY_URL || "https://lightswind.com";
      const url = `${registryBase}/r/${componentName}.json`;
      const res = await makeRequest(url, 'GET');
      data = JSON.parse(res);
    }

    if (data && data.files && data.files.length > 0) {
      const fileObj = data.files[0];
      const componentCode = fileObj.content;
      const registryDeps = data.dependencies || [];
      const autoDetectedExtDeps = detectExternalDependencies(componentCode);
      const componentDeps = [...new Set([...registryDeps, ...autoDetectedExtDeps])];
      const registryInternalDeps = data.internalDependencies || [];
      const autoDetectedDeps = detectInternalDependencies(componentCode);
      const internalDeps = [...new Set([...registryInternalDeps, ...autoDetectedDeps])];

      const toPath = path.join(paths.ALL_UI_TO, componentFile);
      fs.ensureDirSync(path.dirname(toPath));

      let finalCode = rewriteImports(componentCode);
      fs.writeFileSync(toPath, finalCode, 'utf8');
      console.log(`✅ Installed component: ${componentFile} (Registry CDN)`);

      const userPkg = readUserPackageJson();
      const missingDeps = getMissingDependencies(componentDeps, userPkg);

      if (missingDeps.length > 0) {
        if (isCategoryInstall) {
          missingDeps.forEach(dep => _accumulatedDeps.add(dep));
        } else {
          if (isRoot) {
            console.log(`📦 ${componentName} requires: ${missingDeps.join(", ")}`);
            const shouldInstall = await promptUser("Install dependencies? (Y/n): ");
            if (shouldInstall) {
              installDependencies(missingDeps);
            } else {
              console.log("⚠️  Skipping dependency installation.");
            }
          } else {
            installDependencies(missingDeps);
          }
        }
      }

      // Install any internally imported components recursively
      if (internalDeps.length > 0) {
        console.log(`🔗 Installing sub-component dependencies...`);
        for (const dep of internalDeps) {
          await installComponent(dep, visited, isCategoryInstall);
        }
      }

      installedFromCdn = true;
    } else if (data.error) {
      // Component explicitly not found on free registry — try Pro server
      throw new Error('not_found_on_free_registry');
    }
  } catch (error) {
    if (error.message === 'not_found_on_free_registry' || error.message.includes('404') || error.message.includes('not found')) {
      // Component is not in the free registry — try Pro server
      console.log(`🔒 '${componentName}' not found in free registry. Checking Pro server...`);
    } else {
      // Network error — fallback to local package source
      console.log(`⚠️  Could not reach registry (${error.message}). Falling back to local package source...`);
      // Try local copy as network fallback
      if (localSourceExists) {
        if (copyComponent(componentName)) {
          console.log(`✅ Installed ${componentName} component (Local fallback)`);
        }
        installedFromCdn = true; // Mark as done so we skip Pro check
      }
    }
  }

  if (!installedFromCdn) {
    // Not in free registry (or registry unreachable) — try Pro server
    console.log(`\n🔒 Fetching premium component '${componentName}' from Pro server...`);
    const apiKey = getApiKey();
    if (!apiKey) {
      console.error(`\n❌ Component '${componentName}' not found in the free registry.`);
      console.error("If this is a Pro component, please login first:");
      console.error("  npx lightswind auth login --key=YOUR_KEY");
      console.error("  Get your key at: https://pro.lightswind.com/setting/license");
      console.error("\nIf you believe this is a bug, check the component name at: https://lightswind.com/components\n");
      process.exit(1);
    }

      const apiUrl = getApiUrl();
      const url = `${apiUrl}/api/v1/components?name=${componentName}`;

      try {
        const res = await makeRequest(url, 'GET', null, {
          'x-api-key': apiKey
        });
        const data = JSON.parse(res);

        if (!data.success || !data.component) {
          throw new Error(data.error || "Component retrieval failed.");
        }

        const componentCode = data.component.code;
        const registryDeps = data.component.dependencies || [];
        const autoDetectedExtDeps = detectExternalDependencies(componentCode);
        const componentDeps = [...new Set([...registryDeps, ...autoDetectedExtDeps])];
        const registryInternalDeps = data.component.internalDependencies || [];
        const autoDetectedDeps = detectInternalDependencies(componentCode);
        const internalDeps = [...new Set([...registryInternalDeps, ...autoDetectedDeps])];

        const toPath = path.join(paths.ALL_UI_TO, componentFile);
        fs.ensureDirSync(path.dirname(toPath));

        let finalCode = rewriteImports(componentCode);
        fs.writeFileSync(toPath, finalCode, 'utf8');
        if (data.terminalMessage) {
          console.log(data.terminalMessage);
        } else {
          console.log(`✅ Installed component: ${componentFile}`);
        }

        if (componentDeps.length > 0) {
          const userPkg = readUserPackageJson();
          const missingDeps = getMissingDependencies(componentDeps, userPkg);
          if (missingDeps.length > 0) {
            if (isCategoryInstall) {
              missingDeps.forEach(dep => _accumulatedDeps.add(dep));
            } else {
              console.log(`📦 ${componentName} requires external packages: ${missingDeps.join(", ")}`);
              const shouldInstall = !isRoot || await promptUser("Install dependencies? (Y/n): ");
              if (shouldInstall) {
                installDependencies(missingDeps);
              }
            }
          }
        }

        if (internalDeps.length > 0) {
          console.log(`🔗 Installing ${internalDeps.length} sub-component dependencies: ${internalDeps.join(", ")}...`);
          for (const dep of internalDeps) {
            await installComponent(dep, visited, isCategoryInstall);
          }
        }

    } catch (error) {
      console.error(`❌ Failed to retrieve component '${componentName}':`, error.message);
      process.exit(1);
    }
  }

  // Only run post-install configuration if this is the root component being installed and not part of a category/all install
  if (isRoot && !isCategoryInstall) {
    await copySharedUtils();
    autoConfigureTailwindPlugin();

    console.log(`\n🎉 Success! ${componentName} is ready to use.`);
    console.log(`\nImport it: import { ${toPascalCase(componentName)} } from '@/components/lightswind/${componentName}'\n`);
  }
}

/**
 * Install a specific block
 */
async function installBlock(blockName, visited = new Set()) {
  if (!blockName) {
    console.error("❌ Please specify a block name");
    console.error("Usage: npx lightswind@latest add-block <block-name>");
    console.error("Example: npx lightswind@latest add-block bento-feature-manifest\n");
    process.exit(1);
  }

  if (visited.has(blockName)) return;
  const isRoot = visited.size === 0;
  visited.add(blockName);

  const paths = getPaths();
  const blockFile = `${blockName}.tsx`;

  if (isRoot) {
    console.log(`\n📦 Installing block: ${blockName}...`);
    console.log(`📦 Detected: ${paths.FRAMEWORK.name}`);
    console.log(`📁 Installing to: ${paths.ALL_UI_TO}/blocks\n`);
  }

  // Fetch block from secure-block endpoint
  console.log(`⏳ Fetching block '${blockName}' from Lightswind server...`);
  const apiKey = getApiKey();
  
  // Note: For free blocks, they don't strictly require an API key to download,
  // but if the user has an API key, we send it anyway to unlock premium blocks.
  const apiUrl = getApiUrl();
  const url = `${apiUrl}/api/v1/secure-block?id=${blockName}`;
  const headers = {};
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  try {
    const res = await makeRequest(url, 'GET', null, headers);
    const data = JSON.parse(res);

    if (!data.success || !data.block) {
      throw new Error(data.error || "Block retrieval failed.");
    }

    const blockCode = data.block.code;
    const registryDeps = data.block.dependencies || [];
    const autoDetectedExtDeps = detectExternalDependencies(blockCode);
    const blockDeps = [...new Set([...registryDeps, ...autoDetectedExtDeps])];
    const registryInternalDeps = data.block.internalDependencies || [];
    const autoDetectedDeps = detectInternalDependencies(blockCode);
    const internalDeps = [...new Set([...registryInternalDeps, ...autoDetectedDeps])];

    // Ensure the blocks subfolder exists
    const toPath = path.join(paths.ALL_UI_TO, 'blocks', blockFile);
    fs.ensureDirSync(path.dirname(toPath));

    // Rewrite imports
    let finalCode = rewriteImports(blockCode);
    
    fs.writeFileSync(toPath, finalCode, 'utf8');
    
    if (data.terminalMessage) {
      console.log(data.terminalMessage);
    } else {
      console.log(`✅ Installed block: ${blockFile}`);
    }

    // Install external package dependencies (e.g. framer-motion, lucide-react)
    if (blockDeps.length > 0) {
      const userPkg = readUserPackageJson();
      const missingDeps = getMissingDependencies(blockDeps, userPkg);
      if (missingDeps.length > 0) {
        console.log(`📦 ${blockName} requires external packages: ${missingDeps.join(", ")}`);
        const shouldInstall = !isRoot || await promptUser("Install dependencies? (Y/n): ");
        if (shouldInstall) {
          installDependencies(missingDeps);
        }
      }
    }

    // Install internal sub-component dependencies (e.g., button, card)
    if (internalDeps.length > 0) {
      console.log(`🔗 Installing ${internalDeps.length} sub-component dependencies: ${internalDeps.join(", ")}...`);
      for (const dep of internalDeps) {
        await installComponent(dep, new Set(), true);
      }
    }

  } catch (error) {
    console.error(`\n❌ Failed to retrieve block '${blockName}':`, error.message);
    if (error.message.includes("subscription is required") || error.message.includes("Unauthorized")) {
      console.error("💡 This is a Pro block. Make sure to authenticate with: npx lightswind auth login --key=YOUR_KEY\n");
    }
    process.exit(1);
  }

  // Post-install setup
  if (isRoot) {
    await copySharedUtils();
    autoConfigureTailwindPlugin();

    console.log(`\n🎉 Success! Block '${blockName}' is ready to use.`);
    console.log(`\nImport it: import ${toPascalCase(blockName)} from '@/components/lightswind/blocks/${blockName}'\n`);
  }
}


/**
 * Group components by category
 */
function groupComponentsByCategory() {
  // Map of components to their categories based on component-categories.ts
  const COMPONENT_CATEGORY_MAP = {
    // Utilities
    "toggle-theme": "utility",
    "animated-copy-button": "utility",
    "cool-theme-toggle": "utility",
    "draggable-reorder-list": "utility",
    "expandable-search-bar": "utility",
    "expandable-speed-dial": "utility",
    "slide-to-confirm": "utility",
    "SpectrumLoader": "utility",
    "spectrum-loader": "utility",

    // Background
    "animated-wave": "background",
    "animated-bubble-particles": "background",
    "aurora-shader": "background",
    "beam-grid-background": "background",
    "fall-beam-background": "background",
    "grid-dot-backgrounds": "background",
    "gradient-background": "background",
    "hell-background": "background",
    "interactive-grid-background": "background",
    "particles-background": "background",
    "rays-background": "background",
    "reflect-background": "background",
    "smokey-background": "background",
    "shader-background": "background",
    "sparkle-particles": "background",
    "stripes-background": "background",
    "wave-background": "background",
    "liquid-fluid": "background",
    "animated-blob-background": "background",
    "animated-ocean-waves": "background",
    "aurora-background": "background",
    "dot-grid-background": "background",
    "dot-pattern": "background",
    "glowing-background": "background",
    "glowing-lights": "background",
    "liquid-surface": "background",

    // Button
    "border-beam": "button",
    "confetti-button": "button",
    "gradient-button": "button",
    "ripple-button": "button",
    "shine-button": "button",
    "trial-button": "button",
    "magnetic-button": "button",
    "gradient-btn-home": "button",

    // Text
    "aurora-text-effect": "text",
    "scroll-reveal": "text",
    "shiny-text": "text",
    "text-scroll-marquee": "text",
    "typewriter-input": "text",
    "typing-text": "text",
    "video-text": "text",
    "looping-words": "text",
    "rolling-text-3d": "text",
    "video-modal": "ui",

    // 3D Elements
    "3d-image-ring": "3d",
    "3d-image-carousel": "3d",
    "3d-carousel": "3d",
    "3d-hover-gallery": "3d",
    "3d-marquee": "3d",
    "3d-model-viewer": "3d",
    "3d-perspective-card": "3d",
    "3d-scroll-trigger": "3d",
    "3d-slider": "3d",
    "beam-circle": "3d",
    "chain-carousel": "3d",
    "plasma-globe": "3d",
    "scroll-carousel": "3d",
    "sparkle-navbar": "3d",
    "angled-slider": "3d",
    "3d-MarqueewithCustomComponents": "3d",
    "3d-image-gallery": "3d",
    "3d-image-slider": "3d",
    "HangingIdCard": "3d",
    "ThreeDImageCarousel": "3d",
    "ascii-wave": "3d",
    "infinite-drift": "3d",
    "infinite-webgl-scroll": "3d",
    "stylish-carousel": "3d",
    "scroll-para-3d": "3d",
    "scroll-trigger-carousel": "3d",

    // Cursor
    "canvas-confetti-cursor": "cursor",
    "particle-orbit-effect": "cursor",
    "smokey-cursor": "cursor",
    "smooth-cursor": "cursor",
    "SparkleCursor": "cursor",
    "sparkle-cursor": "cursor",
    "smokey-cursor-hero": "cursor",

    // Components (Animated)
    "animated-notification": "components",
    "bento-grid": "components",
    "code-hover-cards": "components",
    "count-up": "components",
    "dock": "components",
    "Dock": "components",
    "drag-order-list": "components",
    "dynamic-navigation": "components",
    "electro-border": "components",
    "glass-folder": "components",
    "globe": "components",
    "glowing-cards": "components",
    "hamburger-menu-overlay": "components",
    "image-reveal": "components",
    "image-trail-effect": "components",
    "interactive-card": "components",
    "interactive-gradient-card": "components",
    "iphone16-pro": "components",
    "lens": "components",
    "magic-loader": "components",
    "morphing-navigation": "components",
    "orbit-card": "components",
    "password-strength-indicator": "components",
    "scroll-list": "components",
    "scroll-cards": "components",
    "scroll-para": "components",
    "scroll-stack": "components",
    "scroll-timeline": "components",
    "seasonal-hover-cards": "components",
    "sliding-cards": "components",
    "sliding-logo-marquee": "components",
    "stack-list": "components",
    "team-carousel": "components",
    "terminal-card": "components",
    "top-loader": "components",
    "top-sticky-bar": "components",
    "trusted-users": "components",
    "ripple-loader": "components",
    "woofy-hover-image": "components",
    "connection-graph": "components",
    "magic-card": "components",
    "CinematicScroll": "components",
    "ScrollSnapCarouselPin": "components",
    "ScrollVelocityContainer": "components",
    "ai-prompt": "components",
    "animated-range-input": "components",
    "cool-bento-effect": "components",
    "dynamic-island": "components",
    "image-sliding-marquee": "components",
    "interactive-card-gallery": "components",
    "marquee-menu": "components",

    // Layout
    "accordion": "layout",
    "aspect-ratio": "layout",
    "resizable": "layout",
    "scroll-area": "layout",
    "separator": "layout",
    "tabs": "layout",

    // UI Elements
    "alert": "ui",
    "alert-dialog": "ui",
    "avatar": "ui",
    "badge": "ui",
    "button": "ui",
    "card": "ui",
    "carousel": "ui",
    "chart": "ui",
    "collapsible": "ui",
    "context-menu": "ui",
    "dialog": "ui",
    "drawer": "ui",
    "dropdown-menu": "ui",
    "hover-card": "ui",
    "popover": "ui",
    "progress": "ui",
    "sheet": "ui",
    "skeleton": "ui",
    "table": "ui",
    "toast": "ui",
    "toaster": "ui",
    "tooltip": "ui",

    // Form Controls
    "calendar": "form",
    "checkbox": "form",
    "command": "form",
    "form": "form",
    "input": "form",
    "input-otp": "form",
    "label": "form",
    "radio-group": "form",
    "select": "form",
    "slider": "form",
    "switch": "form",
    "textarea": "form",
    "toggle": "form",
    "toggle-group": "form",

    // Navigation
    "breadcrumb": "navigation",
    "navigation-menu": "navigation",
    "pagination": "navigation",
    "sidebar": "navigation",
    "menubar": "navigation",
    "nav-effect": "navigation"
  };

  const groups = {
    utility: { name: 'Utilities', emoji: '🛠️', components: [] },
    background: { name: 'Background', emoji: '🌅', components: [] },
    button: { name: 'Button', emoji: '🔘', components: [] },
    text: { name: 'Text', emoji: '📝', components: [] },
    '3d': { name: '3D Elements', emoji: '🧊', components: [] },
    cursor: { name: 'Cursor', emoji: '🖱️', components: [] },
    components: { name: 'Components', emoji: '🧩', components: [] },
    layout: { name: 'Layout', emoji: '📐', components: [] },
    ui: { name: 'UI Elements', emoji: '🎨', components: [] },
    form: { name: 'Form Controls', emoji: '📝', components: [] },
    navigation: { name: 'Navigation', emoji: '🧭', components: [] },
    basic: { name: 'Basic UI', emoji: '✨', components: [] },
    charts: { name: 'Chart Components', emoji: '📊', components: [] },
    specialized: { name: 'Specialized Components', emoji: '🔮', components: [] }
  };

  Object.keys(COMPONENT_DEPS_MAP).forEach((component) => {
    const category = COMPONENT_CATEGORY_MAP[component];
    if (category && groups[category]) {
      groups[category].components.push(component);
    } else {
      const deps = COMPONENT_DEPS_MAP[component];
      if (deps.length === 0) {
        groups.basic.components.push(component);
      } else if (deps.includes("recharts")) {
        groups.charts.components.push(component);
      } else {
        groups.specialized.components.push(component);
      }
    }
  });

  return groups;
}

/**
 * Install all components from a specific category.
 * Fetches the live registry to get category data automatically.
 */
async function installCategory(categoryName) {
  const paths = getPaths();
  const key = getCategoryKey(categoryName);

  if (!key) {
    console.error(`\n❌ Category '${categoryName}' not found.`);
    console.log("Available categories:");
    console.log("  • professional  (All Professional components)");
    console.log("  • animated      (All Animated components)");
    console.log("  • background, button, text, 3d, cursor, components, layout, ui, form, navigation");
    console.log("");
    process.exit(1);
  }

  let targetComponents = [];
  let categoryDisplayName = categoryName;
  let emoji = "📦";

  console.log(`\n⏳ Fetching category data from Lightswind registry...`);
  const registry = await fetchRegistry();

  if (registry && registry.items && registry.items.length > 0) {
    // Use live registry filtered by category
    if (key === 'professional') {
      categoryDisplayName = 'Professional Components';
      emoji = '💼';
      const proCats = ['utility', 'layout', 'ui', 'form', 'navigation'];
      targetComponents = registry.items
        .filter(item => proCats.includes(item.meta?.category))
        .map(item => item.name);
    } else if (key === 'animated') {
      categoryDisplayName = 'Animated Components';
      emoji = '✨';
      const animCats = ['utility', 'background', 'button', '3d', 'cursor', 'text', 'components'];
      targetComponents = registry.items
        .filter(item => animCats.includes(item.meta?.category))
        .map(item => item.name);
    } else {
      // Filter by exact category key from registry
      const matchingItems = registry.items.filter(item => {
        const cat = (item.meta?.category || '').toLowerCase();
        return cat === key || item.name.toLowerCase().startsWith(key);
      });
      targetComponents = matchingItems.map(item => item.name);
      categoryDisplayName = key.charAt(0).toUpperCase() + key.slice(1);
      emoji = '🧩';
    }
    console.log(`✅ Found ${targetComponents.length} components in '${categoryDisplayName}'`);
  } else {
    // Fallback to local hardcoded groups
    console.log(`⚠️  Using local component list (registry unreachable)...`);
    const groups = groupComponentsByCategory();
    if (key === 'professional') {
      categoryDisplayName = 'Professional Components';
      emoji = '💼';
      ['utility', 'layout', 'ui', 'form', 'navigation'].forEach(cat => {
        if (groups[cat]) targetComponents.push(...groups[cat].components);
      });
    } else if (key === 'animated') {
      categoryDisplayName = 'Animated Components';
      emoji = '✨';
      ['utility', 'background', 'button', '3d', 'cursor', 'text', 'components'].forEach(cat => {
        if (groups[cat]) targetComponents.push(...groups[cat].components);
      });
    } else {
      const cat = groups[key];
      if (cat) {
        targetComponents = cat.components;
        categoryDisplayName = cat.name;
        emoji = cat.emoji;
      }
    }
  }

  targetComponents = [...new Set(targetComponents)];

  if (targetComponents.length === 0) {
    console.error(`\n❌ No components found in category '${categoryDisplayName}'.`);
    console.error(`Try: npx lightswind list  to see available components\n`);
    process.exit(1);
  }

  _accumulatedDeps.clear();

  console.log(`\n${emoji} Installing ${categoryDisplayName}...`);
  console.log(`📦 Detected: ${paths.FRAMEWORK.name}`);
  console.log(`📁 Installing to: ${paths.ALL_UI_TO}`);
  console.log(`📊 Total components: ${targetComponents.length}\n`);

  // Install components via CDN (each installComponent call fetches from registry)
  let installedCount = 0;
  const visited = new Set();
  for (const comp of targetComponents) {
    await installComponent(comp, visited, true);
    installedCount++;
  }

  // Batch install all accumulated dependencies at the very end
  if (_accumulatedDeps.size > 0) {
    const userPkg = readUserPackageJson();
    const finalDeps = getMissingDependencies([..._accumulatedDeps], userPkg);
    if (finalDeps.length > 0) {
      console.log(`📦 Components require the following external packages: ${finalDeps.join(", ")}`);
      const shouldInstall = await promptUser("Install these dependencies now? (Y/n): ");
      if (shouldInstall) {
        installDependencies(finalDeps);
      } else {
        console.log("⚠️  Skipping dependency installation. You must install them manually.");
      }
    }
  }

  // Copy shared utilities
  await copySharedUtils();

  // Auto-configure Tailwind plugin
  autoConfigureTailwindPlugin();

  console.log(`\n✅ Installed ${installedCount} components from ${categoryDisplayName}`);
  console.log(`\n🎉 ${categoryDisplayName} ready to use!`);
  console.log(targetComponents.slice(0, 8).map(c => `  • ${c}`).join("\n"));
  if (targetComponents.length > 8) console.log(`  ... and ${targetComponents.length - 8} more\n`);
  else console.log("");

  // Track category install analytics
  trackCLIAnalytics(targetComponents, `category-${key}`);
}

/**
 * List all available components from the live registry
 */
async function listComponents() {
  console.log("\n📋 Fetching available Lightswind Components from registry...\n");

  const registry = await fetchRegistry();

  if (registry && registry.items && registry.items.length > 0) {
    // Group by category from registry metadata
    const grouped = {};
    for (const item of registry.items) {
      const cat = item.meta?.category || 'other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item.name);
    }

    const catEmoji = {
      background: '🌅', button: '🔘', text: '📝',
      '3d': '🧠', cursor: '🖱️', components: '🧩',
      layout: '📐', ui: '🎨', form: '📝',
      navigation: '🧭', utility: '🛠️', other: '✨'
    };

    for (const [cat, names] of Object.entries(grouped)) {
      const emoji = catEmoji[cat] || '📦';
      console.log(`${emoji} ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${names.length}):`);
      names.forEach(n => console.log(`  • ${n}`));
      console.log("");
    }
    console.log(`Total: ${registry.items.length} components available at https://lightswind.com\n`);
  } else {
    // Fallback to COMPONENT_DEPS_MAP count
    const total = Object.keys(COMPONENT_DEPS_MAP).length;
    console.log(`⚠️  Could not reach registry. Local package has ${total} components.`);
    console.log("View all components at: https://lightswind.com/components\n");
  }
}



/**
 * Show help message
 */
function showHelp() {
  console.log("\n⚡ Lightswind UI CLI\n");
  console.log("Usage:");
  console.log("  npx lightswind@latest <command> [options]\n");
  console.log("Commands:");
  console.log("  auth login --key=<key>     Authenticate with your Pro license API key");
  console.log("  auth logout                Remove saved credentials from this machine");
  console.log("  init                       Install all components, utilities, and run interactive theme setup");
  console.log("  init --professional, -p    Install only professional components");
  console.log("  init --animated, -a        Install only animated components");
  console.log("  add <component-name>       Install a specific component");
  console.log("  add --category <name>     Install all components from category");
  console.log("  add-block <block-name>     Install a specific section block");
  console.log("  list                       Show all available components");
  console.log("  theme                      Re-run interactive theme setup to change color palette");
  console.log("  effect3d <on|off>         Toggle 3D depth and bevel shading globally across all components");
  console.log("  init-cursor                Generate .cursorrules and .windsurfrules for AI agent optimization");
  console.log("  mcp                        Run the Lightswind MCP server for real-time AI component access");
  console.log("  mcp init                   Auto-configure MCP server config in Cursor and Claude Desktop\n");
  console.log("Categories:");
  console.log("  basic, ui, animated, 3d, charts, specialized\n");
  console.log("Examples:");
  console.log("  npx lightswind@latest init");
  console.log("  npx lightswind@latest init --professional");
  console.log("  npx lightswind auth login --key=sk_pro_xxx");
  console.log("  npx lightswind@latest add button");
  console.log("  npx lightswind@latest add-block bento-feature-manifest");
  console.log("  npx lightswind@latest effect3d on");
  console.log("  npx lightswind@latest list\n");
  console.log("Learn more: https://lightswind.com\n");
}

/**
 * Remove saved credentials from ~/.lightswindrc
 */
async function handleLogout() {
  const rcPath = getRcPath();
  if (!fs.existsSync(rcPath)) {
    console.log('\n⚠️  No credentials found. You are not logged in.\n');
    return;
  }

  const config = readRcConfig();
  const savedKey = config.apiKey;

  // Best-effort: notify the server so the activity log shows "Logout"
  if (savedKey) {
    try {
      const apiUrl = config.apiUrl || 'https://pro.lightswind.com';
      await makeRequest(
        `${apiUrl}/api/v1/auth/activity`,
        'POST',
        JSON.stringify({ licenseKey: savedKey, action: 'logout' })
      );
    } catch (_) {
      // Non-critical — proceed with local logout regardless
    }
  }

  delete config.apiKey;
  delete config.apiUrl;
  // If nothing left in config, remove the file entirely; else write back
  if (Object.keys(config).length === 0) {
    fs.removeSync(rcPath);
  } else {
    writeRcConfig(config);
  }
  console.log('\n✅ Logged out. Credentials removed from ~/.lightswindrc');
  console.log('   Run `npx lightswind auth login --key=<YOUR_KEY>` to re-authenticate.\n');
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Setup Lightswind MCP server configuration for Cursor and Claude Desktop automatically
 */
async function handleMcpSetup() {
  console.log("\n⚙️  Setting up Lightswind MCP Server configuration...");

  const home = os.homedir();
  const pkgJson = require("../package.json");
  const pkgName = pkgJson.name || "lightswind";
  const mcpConfig = {
    command: "npx",
    args: ["-y", "-p", pkgName, "lightswind", "mcp"]
  };

  let cursorConfigPath = null;
  let claudeConfigPath = null;

  if (process.platform === "win32") {
    if (process.env.USERPROFILE) {
      cursorConfigPath = path.join(process.env.USERPROFILE, ".cursor", "mcp.json");
    }
    if (process.env.APPDATA) {
      claudeConfigPath = path.join(process.env.APPDATA, "Claude", "claude_desktop_config.json");
    }
  } else {
    cursorConfigPath = path.join(home, ".cursor", "mcp.json");
    if (process.platform === "darwin") {
      claudeConfigPath = path.join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json");
    } else {
      claudeConfigPath = path.join(home, ".config", "Claude", "claude_desktop_config.json");
    }
  }

  const injectConfig = (filePath, configName) => {
    if (!filePath) return;
    try {
      fs.ensureDirSync(path.dirname(filePath));
      let content = { mcpServers: {} };
      
      if (fs.existsSync(filePath)) {
        try {
          content = fs.readJsonSync(filePath);
          if (!content || typeof content !== "object") {
            content = { mcpServers: {} };
          }
          if (!content.mcpServers || typeof content.mcpServers !== "object") {
            content.mcpServers = {};
          }
        } catch (e) {
          console.warn(`⚠️  Existing ${configName} config was malformed. Creating fresh setup...`);
          try {
            fs.copySync(filePath, `${filePath}.bak`);
          } catch (_) {}
          content = { mcpServers: {} };
        }
      }

      content.mcpServers["lightswind-ui"] = mcpConfig;
      fs.writeJsonSync(filePath, content, { spaces: 2 });
      console.log(`✅ Configured Lightswind MCP server in ${configName} (${path.basename(filePath)})`);
    } catch (error) {
      console.error(`❌ Failed to configure ${configName}:`, error.message);
    }
  };

  injectConfig(cursorConfigPath, "Cursor");
  injectConfig(claudeConfigPath, "Claude Desktop");

  console.log("\n🎉 MCP Server configured successfully!");
  console.log("Please restart your Cursor or Claude Desktop app to activate the connection.\n");
}

// --- Main ---

let command = process.argv[2];
let arg = process.argv[3];

// Auto-correct double-command typos (e.g., "add add <component>" or "add-block add-block <block>")
if (command === "add" && arg === "add") {
  arg = process.argv[4];
} else if (command === "add-block" && arg === "add-block") {
  arg = process.argv[4];
}

(async () => {
  switch (command) {
    case "auth": {
      const subCommand = (arg || '').toLowerCase();
      if (subCommand === "login") {
        let key = null;
        const keyArg = process.argv.slice(4).find(a => a.startsWith('--key='));
        if (keyArg) {
          key = keyArg.split('=')[1];
        } else {
          key = process.argv[4];
        }

        if (!key) {
          console.error("\n❌ Please specify your Pro API key.");
          console.error("Usage: npx lightswind auth login --key=<YOUR_KEY>");
          console.error("You can generate a key at: https://pro.lightswind.com/setting/license\n");
          process.exit(1);
        }
        await handleLogin(key);
      } else if (subCommand === "logout") {
        handleLogout();
      } else {
        console.error(`\n❌ Unknown auth subcommand: ${subCommand}`);
        console.error("Usage: npx lightswind auth login --key=<YOUR_KEY>");
        console.error("       npx lightswind auth logout\n");
        process.exit(1);
      }
      break;
    }
    case "init": {
      let filter = null;
      if (process.argv.includes('--professional') || process.argv.includes('-p')) {
        filter = 'professional';
      } else if (process.argv.includes('--animated') || process.argv.includes('-a')) {
        filter = 'animated';
      }
      await installAll(filter);
      break;
    }
    case "add":
      if (arg === "--category" || arg === "-c") {
        const categoryName = process.argv[4];
        if (!categoryName) {
          console.error("\n❌ Please specify a category name");
          console.error("Usage: npx lightswind@latest add --category <name>\n");
          process.exit(1);
        }
        await installCategory(categoryName);
      } else {
        await installComponent(arg);
      }
      break;
    case "add-block":
      await installBlock(arg);
      break;
    case "list":
      listComponents();
      break;
    case "theme":
      await runThemeSetup();
      break;
    case "effect3d": {
      const status = arg || '';
      if (status !== 'on' && status !== 'off') {
        console.error("\n❌ Please specify 'on' or 'off'.");
        console.error("Usage: npx lightswind effect3d <on|off>\n");
        process.exit(1);
      }
      toggle3D(status);
      break;
    }
    case "init-cursor":
      generateCursorRules();
      break;
    case "mcp": {
      const subCommand = (arg || '').toLowerCase();
      if (subCommand === "install" || subCommand === "setup" || subCommand === "init") {
        await handleMcpSetup();
      } else {
        if (process.stdout.isTTY) {
          console.log("\n🚀 Initializing Lightswind MCP Server...");
          console.log("This server connects your AI Agent (Cursor, Claude Desktop, Windsurf, etc.) to Lightswind UI components.");
          console.log("Starting MCP server process...\n");
        }
        try {
          const mcpScriptPath = path.join(__dirname, "..", "dist", "mcp", "index.js");
          execSync(`node "${mcpScriptPath}"`, { stdio: "inherit" });
        } catch (error) {
          console.error("❌ Failed to start MCP Server:", error.message);
          process.exit(1);
        }
      }
      break;
    }
    case "--help":
    case "-h":
    case "help":
      showHelp();
      break;
    default:
      if (!command) {
        showHelp();
      } else {
        console.error(`\n❌ Unknown command: ${command}\n`);
        showHelp();
      }
      process.exit(1);
  }
})();
