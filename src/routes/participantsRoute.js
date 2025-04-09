const express = require('express');
const router = express.Router();
const {participantsRegistration, viewPartipantsRegistration, participantsDeRegistration} = require("../controllers/participantsController");
const { authorization } = require("../middlewares/authMiddleware");
const {validateParticipants} = require("../middlewares/validationMiddleware");

router.post("/events/:id", [authorization, validateParticipants], participantsRegistration);
router.get("/events", [authorization, validateParticipants], viewPartipantsRegistration);
router.delete("/events/:id", [authorization, validateParticipants], participantsDeRegistration);

module.exports = router;