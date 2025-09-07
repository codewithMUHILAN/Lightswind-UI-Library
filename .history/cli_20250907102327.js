#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");

// --- Path Definitions ---
const distComponentsDir = path.join(__dirname, "dist", "components");
const srcComponentsDir = path.join(process.cwd(), "src", "components");

// Source paths from the package
const libFrom = path.join(distComponentsDir, "lib");
const styleFrom = path.join(distComponentsDir, "styles", "lightswind.css");
const hooksFrom = path.join(distComponentsDir, "hooks");
const allUiFrom = path.join(distComponentsDir, "ui");

// Destination paths in the user's project
const libTo = path.join(srcComponentsDir, "lib");
const styleTo = path.join(srcComponentsDir, "lightswind.css");
const hooksTo = path.join(srcComponentsDir, "hooks");
const allUiTo = path.join(srcComponentsDir, "lightswind");

// --- Main Logic ---
const args = process.argv.slice(2);
const componentArg = args[0];

if (componentArg) {
  // Install a single component
  const fileName = `${componentArg}.js`;
  const fromComponent = path.join(allUiFrom, fileName);
  const toComponent = path.join(allUiTo, fileName);

  if (fs.existsSync(fromComponent)) {
    fs.ensureDirSync(path.dirname(toComponent));
    fs.copySync(fromComponent, toComponent);
    console.log(`✅ Installed component: ${fileName}`);
  } else {
    console.error(`❌ Component '${componentArg}' not found.`);
    process.exit(1);
  }
} else {
  // Install all components
  if (fs.existsSync(allUiFrom)) {
    fs.ensureDirSync(allUiTo);
    fs.copySync(allUiFrom, allUiTo);
    console.log(`✅ Installed all components`);
  } else {
      console.error(`❌ UI components source directory not found.`);
  }
}

// --- Shared Utilities Installation ---
// This function runs after either a single or all components are installed.
function installSharedUtils() {
  let utilsInstalled = false;

  // Copy lib folder
  if (fs.existsSync(libFrom)) {
    fs.ensureDirSync(libTo);
    fs.copySync(libFrom, libTo);
    utilsInstalled = true;
  }

  // Copy hooks folder
  if (fs.existsSync(hooksFrom)) {
    fs.ensureDirSync(hooksTo);
    fs.copySync(hooksFrom, hooksTo);
    utilsInstalled = true;
  }
  
  // Copy styles file
  if (fs.existsSync(styleFrom)) {
    fs.ensureDirSync(path.dirname(styleTo));
    fs.copySync(styleFrom, styleTo);
    utilsInstalled = true;
  }

  if(utilsInstalled) {
      console.log(`✅ Installed shared utils (lib, hooks, styles)`);
  }
}

installSharedUtils();