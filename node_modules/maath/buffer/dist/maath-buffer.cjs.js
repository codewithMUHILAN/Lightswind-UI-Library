'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-buffer.cjs.prod.js");
} else {
  module.exports = require("./maath-buffer.cjs.dev.js");
}
