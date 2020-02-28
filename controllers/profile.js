//mounted on /profile
const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require("../models");

router.post("/", (req, res) => {
console.log(req.body);
let eventState = req.body.eventState;
let eventLocation = req.body.eventLocation;
let cityState = eventState + eventLocation;
console.log(cityState);
console.log(typeof(req.body.eventLocation));
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



// router.post("/", (req, res) => {
//     db.event.create({
//         eventId: req.body.eventId,
//         restaurantId: ,
//         date: req.body.start_time
//     }).then(function(data) {
//         console.log("workingggg babyyyy");
//         res.redirect("/events");
//     })
//     .catch(function (err) {
//         console.log(`Error was made:\n ${err}`);
//     })
//     .finally(function() {
//         console.log("Made it through okay!");
//     });
// });


// using event city, State to search api for Farm to Table restaurants in area
router.get("/", (req, res) => {
    db.events.findOne({
        where: {eventbriteId: req.body.eventId}
      }).then(function(events) {
          let eventLocation = event.location;
        // user will be an instance of User and stores the content of the table entry with id 2. if such an entry is not defined you will get null
        var qs = {
            params: {
                "user-key": process.env.ZMTO_API_KEY,
                query: event.location
            }
        }
        axios.get("https://developers.zomato.com/api/v2.1/locations?", qs)
            .then(function (response) {
                var results = response.data.location_suggestions[0].entity_id;
                var quse = {
                    params: {
                        "user-key": process.env.ZMTO_API_KEY,
                        "entity_id": results,
                        "entity-type": zone,
                        cuisines: "farm to table"
                    }
                }
                axios.get("https://developers.zomato.com/api/v2.1/search?", quse)
                    .then(function (resp) {
                        var resResults = response.data.restaurants.restaurant;
                        res.render("activities/restaurant_plan", { restaurants: resResults });
                    })
                    .catch(function (err) {
                        console.log(`Error was made:\n ${err}`);
                    })
                    .finally(function() {
                        console.log("Made it through okay!");
                    });
            })
      });
})

module.exports = router;