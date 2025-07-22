'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./maath-random.cjs.prod.js");
} else {
  module.exports = require("./maath-random.cjs.dev.js");
}
