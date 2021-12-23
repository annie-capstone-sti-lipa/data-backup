const { initializeApp, backup } = require("firestore-export-import");
const { serviceAccount, collections } = require("./config");
const fs = require("fs");
const { resolve } = require("path");

initializeApp(serviceAccount);

console.log("backup process started:\n");

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
          // console.log(`The backup for ${collection} was saved!`);
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
      console.log("backing up " + collection);
      success = await backupCollection(collection);
      console.log(success);
      console.log("backed up " + collection);
    }
    resolve(success);

    // collections.forEach(async (arg, index) => {
    //   console.log("backing up " + arg);
    //   await new Promise(async (resolve) => {
    //     await backupCollection(arg);
    //     console.log("backed up " + arg);
    //     resolve();
    //   });
    //   if (index === collections.length - 1) {
    //     console.log("resolved");
    //     resolve(true);
    //   }
    // });
  });
};
