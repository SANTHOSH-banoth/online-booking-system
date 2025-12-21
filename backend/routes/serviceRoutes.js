const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

router.get('/', async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

router.post('/', async (req, res) => {
  const service = await Service.create(req.body);
  res.json(service);
});
router.post("/", authMiddleware, adminMiddleware, addService);


module.exports = router;
