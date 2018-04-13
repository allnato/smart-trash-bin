const express   = require('express');
const router    = express.Router();

// Real-time sensor data
router.get('/real-time-sensor', (req, res) => {
    res.render('real-time-sensor.hbs');
});

// Real-time Employee Activity
router.get('/real-time-activity', (req, res) => {
    res.render('real-time-activity.hbs');
});

module.exports = router;