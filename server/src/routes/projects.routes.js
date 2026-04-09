const express = require("express");
const projectController = require("../controllers/project.controller");

const router = express.Router();

router.post("/create", projectController.create);
router.get("/user/:owner", projectController.listByOwner);
router.get("/:id", projectController.getById);
router.put("/:id", projectController.update);
router.delete("/:id", projectController.remove);

module.exports = router;

