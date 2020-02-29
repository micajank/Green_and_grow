//mounted on /profile
const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require("../models");

// Adds an event to list of followed events on profile
router.post("/", (req, res) => {
console.log(req.body);
let eventState = req.body.eventState;
let eventLocation = req.body.eventLocation;
let cityState =  eventLocation + eventState;
    db.event.create({
        title: req.body.eventTitle,
        location: cityState,
        date: req.body.eventDate,
        time: req.body.eventTime,
        eventbriteId: req.body.eventId
    }).then(function(data) {
        console.log("working");
        res.redirect("/events");
    })
    .catch(function (err) {
        console.log(`Error was made:\n ${err}`);
    })
    .finally(function() {
        console.log("Made it through okay!");
    });
});


// Adds a plan to the plan database which needs eventId and restaurantId
router.post("/plan/new", (req, res) => {
    let eventState = req.body.eventState;
    let eventLocation = req.body.eventLocation;
    let cityState = eventLocation + eventState;
    db.event.findOrCreate({
        where: { eventbriteId: req.body.eventId },
        defaults: {
            title: req.body.eventTitle,
            location: req.body.cityState,
            date: req.body.eventDate,
            time: req.body.eventTime
        }
    })
    .then(([event, created]) => {
        db.plan.create({
            eventId: event.id,
            date: req.body.eventDate
        }).then(function(data) {
            console.log("workingggg babyyyy");
            res.redirect(`/profile/plan/restaurants?location=${cityState}&planId=${data.dataValues.id}`);
        })
        .catch(function (err) {
            console.log(`Error was made:\n ${err}`);
        })
        .finally(function() {
            console.log("Made it through okay!");
        });
    })
});


// using event city, State to search api for Farm to Table restaurants in area
router.get("/plan/restaurants", (req, res) => {
    let plan_id = req.query.planId;
        // user will be an instance of User and stores the content of the table entry with id 2. if such an entry is not defined you will get null
        var qs = {
            headers: {
                "user-key": process.env.ZMTO_API_KEY
            },
            params: {
                query: req.query.location
            }
        }
        console.log(qs);
        axios.get("http://developers.zomato.com/api/v2.1/locations?", qs)
            .then(function (response) {
                console.log(response.data);
                var results = response.data.location_suggestions[0].entity_id;
                var quse = {
                    headers: {
                        "user-key": process.env.ZMTO_API_KEY
                    },
                    params: {
                        "entity_id": results,
                        "entity-type": 'city',
                        cuisines: "farm to table"
                    }
                }
                axios.get("http://developers.zomato.com/api/v2.1/search?", quse)
                    .then(function (resp) {
                        var resResults = resp.data.restaurants;
                        res.render(`activities/restaurant_plan`, { restaurants: resResults, plan_id });
                    })
                    .catch(function (err) {
                        console.log(`Error was made:\n ${err}`);
                    })
                    .finally(function() {
                        console.log("Made it through okay!");
                    });
            })
});

router.post("/plan/update", (req, res) => {
        console.log(req.body.restaurantId);
        db.plan.update({
            restaurantId: req.body.restaurantId
        }, {
            where: {
                id: req.body.planId
            }
        })
        console.log("added restaurant to plan table");
        res.render("states/profile")
});

module.exports = router;