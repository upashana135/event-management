const express = require('express');
const router = express.Router();
const {getEvents, createEvents, updateEvents, deleteEvents } = require("../controllers/eventsController");
const { authorization } = require("../middlewares/authMiddleware");
const {validateEventOrganizer, validateEvent} = require("../middlewares/validationMiddleware");

router.get("/", getEvents);
router.post("/", [authorization, validateEventOrganizer, validateEvent], createEvents);
router.put("/", [authorization, validateEventOrganizer, validateEvent], updateEvents);
router.delete("/:id", [authorization, validateEventOrganizer], deleteEvents);

module.exports = router;