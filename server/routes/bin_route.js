const express   = require('express');
const router    = express.Router();

const q_all     = require('./../db/all_query');

router.get('/list', (req, res) => {
    q_all.getAllBinData()
        .then(data => {
            res.render('bin_list.hbs', {
                title: "Smart Bin List",
                uri: "/bin/list",
                list: data
            });
        })
        .catch(err => {
            res.status(500);
            res.send('Internal Server Error');
        });
});

// Real-time sensor data
router.get('/real-time', (req, res) => {
    res.render('real_time_sensor.hbs', {
        title: "Trash Bin Real-Time Sensor",
        uri: "/bin/real-time"
    });
});

// Bin Weekly
router.get('/weekly', (req, res) => {
    res.render('bin_weekly.hbs', {
        title: "Smart Bin Weekly Data",
        uri: "/bin/weekly"
    });
});

// Bin Monthly
router.get('/monthly', (req, res) => {
    res.render('bin_monthly.hbs', {
        title: "Smart Bin Monthly Data",
        uri: "/bin/monthly"
    });
});

// Bin Yearly
router.get('/yearly', (req, res) => {
    res.render('bin_yearly.hbs', {
        title: "Smart Bin Yearly Data",
        uri: "/bin/yearly"
    });
});

module.exports = router;