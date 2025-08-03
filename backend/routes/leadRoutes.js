import express from "express";
import { createLead, getLeads, updateLeadStatus } from "../controllers/leadController.js";

const router = express.Router();

// POST new lead
router.post("/", createLead);

// GET all leads (for admin panel)
router.get("/", getLeads);

router.patch("/:id", updateLeadStatus);

export default router;
