/*
 * MIT License (MIT)
 * Copyright (c) 2018 Activeledger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// require:
var fs = require("fs-extra");

// Where the Definitions are
const inFolder = `${__dirname}/../../node_modules/@activeledger/`;

// Where they are going
const outFolder = `${__dirname}/../../src/assets/definitions/@activeledger/`;

// Which Package to copy
const packages = [
  "activecrypto",
  "activelogger",
  "activedefinitions",
  "activequery",
  "activeutilities",
  "activecontracts",
  "activetoolkits",
];

console.log("====================");
console.log("Setting Definitions");
console.log("====================");

// Loop Eaach and copy
packages.forEach((element) => {
  // Path
  let path = inFolder + element + "/lib";

  console.log("Copying definitions for " + element);

  // Read Directory
  fs.readdir(path, function (err, items) {
    // Loop all items
    for (var i = 0; i < items.length; i++) {
      // Write out
      //console.log(outFolder + element + "/" + items[i]);

      // HACK - Just Copy
      fs.copySync(path + "/" + items[i], outFolder + element + "/" + items[i]);

      if (items[i].indexOf("d.ts") !== -1) {
        let contents = fs
          .readFileSync(path + "/" + items[i])
          .toString()
          .replace(`/// <reference types="node" />`, "")
          .replace(/\n|\r/g, "");
        //replace(/\"/g, `\\"`);

        // Use switch if need to do it on multiple files
        if (items[i] == "stream.d.ts") {
          // Hide "private" methods which are public for internal usage
          contents = contents
            .replace("export2Ledger", "private export2Ledger")
            .replace("throwTo", "private throwTo")
            .replace("updated:", "private updated:")
            .replace("setKey", "private setKey");
        }

        // Make sure directory exists
        fs.ensureDirSync(outFolder + element);

        // Write file
        fs.writeFileSync(outFolder + element + "/" + items[i], contents);
      }

      // else {
      //   // Just Copy
      //   fs.copySync(
      //     path + "/" + items[i],
      //     outFolder + element + "/" + items[i]
      //   );

      // if (items[i].indexOf(".d.ts") !== -1) {
      //   let contents = fs.readFileSync(path + "/" + items[i]).toString();
      //   contents = contents.replace(`/// <reference types="node" />`, "");
      //   fs.mkdirSync(outFolder + element, { recursive: true });
      //   fs.writeFileSync(outFolder + element + "/" + items[i], contents);
      // }
      // }
    }
  });
});

// Node Typescript slightly different
// console.log("** Processing Node Definitions **");

// // Read & strip comments
// let tsNode = fs
//   .readFileSync(
//     `${__dirname}/node.d.ts`,
//     "utf8"
//   )
//   .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1");

// // Make path
// fs.mkdirsSync(`${__dirname}/../../src/assets/definitions_NEW/@types/node/`);

// // Write without .ts as it had build issues on start (duplicate definition error)
// fs.writeFileSync(
//   `${__dirname}/../../src/assets/definitions_NEW/@types/node/index.d`,
//   tsNode
// );

console.log("====================");
console.log("Definitions Complete");
console.log("====================");

/* console.log();
console.log("***** Start Temporary Fix *****");
console.log("Removing @types/selenium-webdriver");
var rimraf = require("rimraf");
rimraf("node_modules/@types/selenium-webdriver", function() {
  console.log("***** Stop Temporary Fix *****");
  console.log();
}); */
