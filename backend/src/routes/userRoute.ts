import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(400).json({ message: "works" });
});

export default router;
