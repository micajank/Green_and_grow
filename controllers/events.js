//mounted on /events
const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require("../models");

const app = express();

// get from api
router.get("/", (req, res) => {
    console.log('👻 here')
    var qs = {
        params: {
            "app_key": process.env.EVFL_API_KEY,
            keywords: "sustainability",
            location: req.query.location ? req.query.location : ''
        }
    }
    axios.get("http://api.eventful.com/json/events/search/", qs)
        .then(function (response) {
            var results = response.data.events.event;
            //response.data.events.event = Object[];
            res.render("activities/events", { events: results });

        })
        .catch(function (err) {
            console.log(`Error was made:\n ${err}`);
        })
        .finally(function() {
            console.log("Made it through okay!");
        });
});

router.get("/:id", (req, res) => {
    var qs = {
        params: {
            "app_key": process.env.EVFL_API_KEY,
            id: req.params
        }
    }
    axios.get("http://api.eventful.com/json/events/get", qs)
    .then(function (response) {
        var results = response.data;
        //might have to send req.user over
        res.render("activities/e_details", { event: results });
    })
    .catch(function (err) {
        console.log(`Error was made:\n ${err}`);
    })
    .finally(function() {
        console.log("Made it through okay!");
    });
});





module.exports = router;