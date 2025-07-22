#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
 
// Define the source and destination folder pairs
const foldersToCopy = [
  {
    from: path.join(__dirname, "dist", "components", "ui"),
    to: path.join(process.cwd(), "src", "components", "lightswind"),
  },
  
  {
    from: path.join(__dirname, "dist", "components", "lib"),
    to: path.join(process.cwd(), "src", "components", "lib"),
  },
];


// Copy each folder
foldersToCopy.forEach(({ from, to }) => {
  fs.ensureDirSync(to);
  fs.copySync(from, to);
  console.log(`✅ Copied from ${from} to ${to}`);
});
