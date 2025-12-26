import express from "express";
import Service from "../models/Service.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET all services (public)
 */
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

/**
 * CREATE a new service (admin only)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const service = await Service.create({ name, price, description });
    res.status(201).json(service);
  } catch (error) {
    console.error("Failed to create service:", error);
    res.status(500).json({ message: "Failed to create service" });
  }
});

/**
 * GET single service by ID (public)
 */
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    console.error("Failed to fetch service:", error);
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

/**
 * UPDATE a service (admin only)
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );

    if (!updatedService) return res.status(404).json({ message: "Service not found" });

    res.json(updatedService);
  } catch (error) {
    console.error("Failed to update service:", error);
    res.status(500).json({ message: "Failed to update service" });
  }
});

/**
 * DELETE a service (admin only)
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Failed to delete service:", error);
    res.status(500).json({ message: "Failed to delete service" });
  }
});

export default router;
