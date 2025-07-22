'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath.cjs.prod.js");
} else {
  module.exports = require("./maath.cjs.dev.js");
}
