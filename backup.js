const { initializeApp, backup } = require("firestore-export-import");
const { serviceAccount, collections } = require("./config");
const fs = require("fs");
const { resolve } = require("path");

initializeApp(serviceAccount);

console.log("backup script initiated:\n");

if (process.argv.includes("all")) {
  collections.forEach((arg) => backupCollection(arg));
} else {
  process.argv.slice(2).forEach((arg) => {
    backupCollection(arg);
  });
}

async function backupCollection(collection) {
  return await new Promise((resolve) => {
    backup(collection).then(async (data) => {
      fs.writeFile(
        `./backup/${collection}.json`,
        JSON.stringify(data),
        function (err) {
          if (err) {
            resolve(false);
            return console.log(err);
          }
          console.log("backed up: " + collection);
          resolve(true);
        }
      );
    });
  });
}

module.exports.backupAll = async () => {
  return await new Promise(async (resolve) => {
    let success = true;
    for (const collection of collections) {
      success = await backupCollection(collection);
      if (success) {
        console.log("backed up: " + collection);
      }
    }
    resolve(success);
  });
};
