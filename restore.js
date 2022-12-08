const { initializeApp, restore } = require("firestore-export-import");
const { serviceAccount, collections } = require("./config");
const fs = require("fs");

initializeApp(serviceAccount);

console.log("restore script initiated:\n");

if (process.argv.includes("all")) {
  collections.forEach((arg) => restoreCollection(arg));
} else {
  process.argv.slice(2).forEach((arg) => {
    restoreCollection(arg);
  });
}

async function restoreCollection(collection) {
  return await new Promise((resolve) => {
    fs.open(`./backup/${collection}.json`, "r", (err, fd) => {
      if (!err && fd) {
        restore(`./backup/${collection}.json`).then((data) => {
          let message = `${collection} has been restored.`;
          console.log(message);
          resolve(message);
        });
      } else {
        let message = `backup file for ${collection} does not exist, the restore process failed.`;
        console.log(message);
        resolve(message);
      }
    });
  });
}

module.exports.restoreOne = async (collection) => {
  return await new Promise(async (resolve) => {
    resolve(await restoreCollection(collection));
  });
};

module.exports.restoreAll = async () => {
  return await new Promise(async (resolve) => {
    let success = "restore process completed.";
    for (const collection of collections) {
      success = await restoreCollection(collection);
    }
    resolve(success);
  });
};
