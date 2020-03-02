//mounted on /profile
const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require("../models");
const isLoggedIn = require('../middleware/isLoggedIn')

router.get("/", isLoggedIn, (req, res) => {
    db.plan.findAll({
        where: { userId: req.user.id }
    })
    .then(function(planData) {
        console.log(planData);
        db.event.findAll({
            where: { userId: req.user.id }
        })
        .then(function(eventData) {
            res.render("states/profile", { user: req.user, plans: planData, events: eventData });
        })
    })
});

// Adds an event to list of followed events on profile
router.post("/", isLoggedIn, (req, res) => {
console.log(req.body);
let eventState = req.body.eventState;
let eventLocation = req.body.eventLocation;
let cityState =  eventLocation + "," + eventState;
    db.event.create({
        userId: req.user.id,
        title: req.body.eventTitle,
        location: cityState,
        date: req.body.eventDate,
        time: req.body.eventTime,
        eventbriteId: req.body.eventId
    }).then(function(data) {
        console.log(cityState + "🥰🥰🥰")
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
router.post("/follow", isLoggedIn, (req, res) => {
        db.restaurant.create({
            userId: req.user.id,
            name: req.body.restaurantName,
            location: req.body.restaurantLocation,
            zomatoId: req.body.restaurantId
        }).then(function(data) {
            res.redirect("/restaurants");
        })
        .catch(function (err) {
            console.log(`Error was made:\n ${err}`);
        })
        .finally(function() {
            console.log("Made it through okay!");
        });
    });


// Adds a plan to the plan database which needs eventId and restaurantId
router.post("/plan/new", isLoggedIn, (req, res) => {
    let eventState = req.body.eventState;
    let eventLocation = req.body.eventLocation;
    let cityState = eventLocation + "," + eventState;
    db.event.findOrCreate({
        where: { eventbriteId: req.body.eventId },
        defaults: {
            userId: req.user.id,
            title: req.body.eventTitle,
            location: cityState,
            date: req.body.eventDate,
            time: req.body.eventTime
        }
    })
    .then(([event, created]) => {
        db.plan.create({
            userId: req.user.id,
            eventId: event.id,
            date: req.body.eventDate
        }).then(function(data) {
            console.log("workingggg babyyyy");
            console.log(cityState);
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
router.get("/plan/restaurants", isLoggedIn, (req, res) => {
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
                var locresults = response.data.location_suggestions[0].entity_id;
                var quse = {
                    headers: {
                        "user-key": process.env.ZMTO_API_KEY
                    },
                    params: {
                        "entity_id": locresults,
                        "entity_type": 'city',
                        cuisines: "farm to table"
                    }
                }
                axios.get("https://developers.zomato.com/api/v2.1/search?", quse)
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

router.post("/plan/update", isLoggedIn, (req, res) => {
        console.log(req.body.restaurantId);
        db.restaurant.findOrCreate({
            where: { zomatoId: req.body.restaurantId },
            defaults: {
                userId: req.user.id,
                name: req.body.restaurantName,
                location: req.body.restaurantLocation
            }
        })
        .then(([restaurant, created]) => {
            db.plan.update({
                restaurantId: req.body.restaurantId
                }, {
                    where: {
                    id: req.body.planId
                    }
                })
            })
            .then(function(data) {
                console.log("workingggg babyyyy");
                res.redirect("/profile");
            })
            .catch(function (err) {
                console.log(`Error was made:\n ${err}`);
            })
            .finally(function() {
                console.log("Made it through okay!");
        });
});

module.exports = router;