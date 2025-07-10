const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Create new project
router.post("/create", async (req, res) => {
  const { title, language, owner } = req.body;

  try {
    const newProject = new Project({ title, language, owner });
    await newProject.save();
    res.status(201).json({ message: "Project created", project: newProject });
  } catch (err) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Get all projects for a user
router.get("/user/:owner", async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.params.owner }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Update project code
router.put("/:id", async (req, res) => {
  const { code, title, language } = req.body;

  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { code, title, language },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated", project: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

// (Optional) Delete project
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

module.exports = router;
