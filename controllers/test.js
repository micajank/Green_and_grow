const express = require("express");
const router = express.Router();

router.get("/test1", (req, res) => {
    res.send("test1");
});

router.post("/test1", (req, res) => {
    res.send("test1");
});

router.get("/:sweetParams", (req, res) => {
    res.send(req.params.sweetParams);
});

module.exports = router;