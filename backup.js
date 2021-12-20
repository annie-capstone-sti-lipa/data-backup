const { initializeApp, backups, backup } = require("firestore-export-import");
const fs = require("fs");

initializeApp(
  require("./church-backend-dbf84-firebase-adminsdk-elg3i-956b61e243.json")
);

process.argv.slice(2).forEach(function (arg, index, array) {
  if (arg === "all") {
    backupAll();
  } else {
    backupOne(arg);
  }
});

function backupOne(collection) {
  backup(collection).then(async (data) => {
    fs.writeFile(
      `./backup/${collection}.json`,
      JSON.stringify(data),
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      }
    );
  });
}

function backupAll() {
  let collections = [
    "death",
    "death_archive",
    "donation",
    "events",
    "marriage",
    "marriage_archive",
    "requests",
    "requests_archive",
    "schedule",
    "schedule_archive",
  ];

  backups(collections).then(async (data) => {
    fs.writeFile("./backup/all.json", JSON.stringify(data), function (err) {
      if (err) {
        console.log("backup failed");
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  });
}
