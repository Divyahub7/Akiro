import Skill from "../models/Skill.js";

export const addSkill = async (req, res) => {
  try {
    const { name, level, category } = req.body;
    const skill = await Skill.create({
      userId: req.user.id,
      name,
      level,
      category,
    });
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.status(200).json(skill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.status(200).json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
