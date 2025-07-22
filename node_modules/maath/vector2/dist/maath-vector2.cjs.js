'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-vector2.cjs.prod.js");
} else {
  module.exports = require("./maath-vector2.cjs.dev.js");
}
