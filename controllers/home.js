const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require("../models");

const app = express();


router.get("/", (req, res) => {
    res.render("states/home");
})







module.exports = router;