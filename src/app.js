////////////////////////////////////////////////////////////////////////////////
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
////////////////////////////////////////////////////////////////////////////////
const { NODE_ENV } = require("./config");
const groupsRouter = require("./groups/groups-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
////////////////////////////////////////////////////////////////////////////////
const app = express();
////////////////////////////////////////////////////////////////////////////////
app.use(morgan((NODE_ENV === "production") ? "tiny" : "common", {
    skip: () => NODE_ENV === "test"
}));
app.use(cors());
app.use(helmet());
////////////////////////////////////////////////////////////////////////////////
app.use("/api/groups", groupsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
    res.json({ ok: true });
});

app.use((error, req, res, next) => {
    let response;

    if (NODE_ENV === "production") {
        response = { error: { message: "server error" } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    };

    res.status(500).json(response);
});

module.exports = app;