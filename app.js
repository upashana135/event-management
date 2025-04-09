const express = require('express');

const app = express();
app.use(express.json());

const users = [];
const events = [];
const participants = [];
app.locals.users = users;
app.locals.events = events;
app.locals.participants = participants;

const usersRouter = require("./src/routes/usersRoute");
const eventsRouter = require("./src/routes/eventsRoute");
const participantsRouter = require("./src/routes/participantsRoute");

app.use("/users", usersRouter);
app.use("/events", eventsRouter);
app.use("/participants", participantsRouter);

module.exports = app;