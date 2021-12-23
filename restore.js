const { initializeApp, restore } = require("firestore-export-import");
const { serviceAccount, collections } = require("./config");

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
    restore(`./backup/${collection}.json`).then((data) => {
      resolve(data.status);
    });
  });
}

module.exports.restoreAll = async () => {
  return await new Promise(async (resolve) => {
    let success = true;
    for (const collection of collections) {
      success = await restoreCollection(collection);
      if (success) {
        console.log("restored " + collection);
      }
    }
    resolve(success);
  });
};
