const User = require("./users.model")

async function list(req, res) {
  const users = await User.find()
  res.send(users);
}

module.exports = {
  list,
};
