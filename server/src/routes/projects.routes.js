const express = require("express");
const { standardRouteLimiter } = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const projectController = require("../controllers/project.controller");

const router = express.Router();

router.use(standardRouteLimiter);

router.use(authMiddleware);

router.post("/create", projectController.create);
router.get("/user/:owner", projectController.listByOwner);
router.get("/:id", projectController.getById);
router.put("/:id", projectController.update);
router.delete("/:id", projectController.remove);

module.exports = router;

