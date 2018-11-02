const express = require("express");
const router = express.Router();
const advertisementController = require("../controllers/advertisementController")

router.get("/advertisements", advertisementController.index);
router.get("/advertisements/new", advertisementController.new);

module.exports = router;
