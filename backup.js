const { initializeApp, backup } = require("firestore-export-import");
const { serviceAccount, collections } = require("./config");
const fs = require("fs");

initializeApp(serviceAccount);

if (process.argv.includes("all")) {
  collections.forEach((arg) => backupCollection(arg));
} else {
  process.argv.slice(2).forEach((arg) => {
    backupCollection(arg);
  });
}

function backupCollection(collection) {
  backup(collection).then(async (data) => {
    fs.writeFile(
      `./backup/${collection}.json`,
      JSON.stringify(data),
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(`The backup for ${collection} was saved!`);
      }
    );
  });
}
