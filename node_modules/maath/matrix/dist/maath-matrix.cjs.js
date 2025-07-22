'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-matrix.cjs.prod.js");
} else {
  module.exports = require("./maath-matrix.cjs.dev.js");
}
