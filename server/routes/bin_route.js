const express   = require('express');
const router    = express.Router();

// Real-time sensor data
router.get('/real-time', (req, res) => {
    res.render('real_time_sensor.hbs');
});

// Bin Weekly
router.get('/weekly', (req, res) => {
    res.render('bin_weekly.hbs');
});

// Bin Monthly
router.get('/monthly', (req, res) => {
    res.render('bin_monthly.hbs');
});

// Bin Yearly
router.get('/yearly', (req, res) => {
    res.render('bin_yearly.hbs');
});

module.exports = router;