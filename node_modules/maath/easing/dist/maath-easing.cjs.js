'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-easing.cjs.prod.js");
} else {
  module.exports = require("./maath-easing.cjs.dev.js");
}
