class Helper {
  static async isAdmin(userId) {
    return (
      await fetch(
        `https://annie-api.azurewebsites.net/get-admins?discordId=${userId}`
      )
        .then(async (response) => await response.json())
        .then((admins) => {
          return admins;
        })
    ).includes(userId);
  }
}

module.exports = Helper;
