const { initializeApp, restore } = require("firestore-export-import");
const { serviceAccount, collections } = require("./config");

initializeApp(serviceAccount);

if (process.argv.includes("all")) {
  collections.forEach((arg) => restoreCollection(arg));
} else {
  process.argv.slice(2).forEach((arg) => {
    restoreCollection(arg);
  });
}

function restoreCollection(collection) {
  restore(`./backup/${collection}.json`).then((data) => {
    console.log(`${collection} ${data.message}`);
  });
}
