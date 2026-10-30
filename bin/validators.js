// Names reach execSync and path.join, so the allowed character sets must exclude shell
// metacharacters, whitespace, path separators and a leading "-" (which npm would read as a flag).
const PACKAGE_SPEC = /^(@[a-z0-9][a-z0-9._~-]*\/)?[a-zA-Z0-9][a-zA-Z0-9._~-]*(@[a-zA-Z0-9.^~+-]+)?$/;
const COMPONENT_NAME = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;

function isSafePackageSpec(spec) {
  return typeof spec === "string" && spec.length <= 214 && PACKAGE_SPEC.test(spec);
}

function isSafeComponentName(name) {
  return typeof name === "string" && name.length <= 128 && COMPONENT_NAME.test(name);
}

module.exports = { isSafePackageSpec, isSafeComponentName };
