'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-three.cjs.prod.js");
} else {
  module.exports = require("./maath-three.cjs.dev.js");
}
