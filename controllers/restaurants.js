// mounted on /restaurants
const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require("../models");

const app = express();

router.get("/", (req, res) => {
    res.render("activities/restaurants_search");
})

router.get("/bylocation", (req, res) => {
    console.log("restuarants js up and running");
    var qs = {
        headers: {
            "user-key": process.env.ZMTO_API_KEY
        },
        params: {
            query: req.query.location
        }
    }
    axios.get("http://developers.zomato.com/api/v2.1/locations?", qs)
    .then(function (response) {
        var results = response.data.location_suggestions[0].entity_id;
        var quse = {
            headers: {
                "user-key": process.env.ZMTO_API_KEY
            },
            params: {
                "entity_id": results,
                "entity_type": 'city',
                cuisines: "farm to table"
            }
        }
        axios.get("http://developers.zomato.com/api/v2.1/search?", quse)
            .then(function (resp) {
                var resResults = resp.data.restaurants;
                res.render("activities/restaurants", { restaurants: resResults });
            })
            .catch(function (err) {
                console.log(`Error was made:\n ${err}`);
            })
            .finally(function() {
                console.log("Made it through okay!");
            });
    })
});

router.post("/:id", (req, res) => {
    var qss = {
        headers: {
            "user-key": process.env.ZMTO_API_KEY
        },
        params: {
            "res_id": req.body.id
        }
    }
    console.log(qss);
    axios.get("https://developers.zomato.com/api/v2.1/restaurant?", qss)
        .then(function (respp) {
            console.log(respp.data);
            var result = respp.data;
            res.render("activities/r_details", { restaurant: result });
        })
        .catch(function (err) {
            console.log(`Error was made:\n ${err}`);
        })
        .finally(function() {
            console.log("Made it through okay😛😛😇😂!");
        });
})
    
module.exports = router;