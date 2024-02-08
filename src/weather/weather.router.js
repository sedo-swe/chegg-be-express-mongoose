const router = require("express").Router({ mergeParams: true });
const controller = require("./weather.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:weatherStatusId")
  .get(controller.read) // Uncomment after implementing Task 4.
  .put(controller.update) // Uncomment after implementing Task 5.
  .delete(controller.delete) // Uncomment after implementing Task 6.
  .all(methodNotAllowed);

router.route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;