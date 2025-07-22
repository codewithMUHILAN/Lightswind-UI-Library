'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-geometry.cjs.prod.js");
} else {
  module.exports = require("./maath-geometry.cjs.dev.js");
}
