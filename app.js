require('dotenv').config();
const express = require('express');
const redis = require('redis');
const PORT = process.env.PORT || 3000;
const redisClient = require('./redisClient');

const app = express();
app.use(express.json());

app.locals.redisClient = redisClient;

const usersRouter = require("./src/routes/usersRoute");
const eventsRouter = require("./src/routes/eventsRoute");
const participantsRouter = require("./src/routes/participantsRoute");

app.use("/users", usersRouter);
app.use("/events", eventsRouter);
app.use("/participants", participantsRouter);

app.listen(PORT, () => {
    console.log("🚀 Server running on port:", PORT);
}).on('error', (e) => console.log(e));

module.exports = app;