'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-triangle.cjs.prod.js");
} else {
  module.exports = require("./maath-triangle.cjs.dev.js");
}
