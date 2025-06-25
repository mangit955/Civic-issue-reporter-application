import express from "express";
const app = express();

// user api's
app.post("/api/v1/signup/user", (req, res) => {});

app.post("/api/v1/signin/user", (req, res) => {});

app.post("/api/v1/issue/user", (req, res) => {});

app.get("/api/v1/issue/user", (req, res) => {});

app.delete("/api/v1/issue/user", (req, res) => {});

//admin api's
app.post("/api/v1/signup/admin", (req, res) => {});

app.post("/api/v1/signin/admin", (req, res) => {});

app.get("/api/v1/issue/admin", (req, res) => {});

app.delete("/api/v1/issue/user", (req, res) => {});
