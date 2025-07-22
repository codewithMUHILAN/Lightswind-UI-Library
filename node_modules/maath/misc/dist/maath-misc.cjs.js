'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-misc.cjs.prod.js");
} else {
  module.exports = require("./maath-misc.cjs.dev.js");
}
