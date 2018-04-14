const express   = require('express');
const router     = express.Router();

// Real-time Employee Activity
router.get('/real-time', (req, res) => {
    res.render('real_time_activity.hbs', {
        title: "Employee Real-Time Activity Tracker",
        uri: "/emp/real-time"
    });
});

router.get('/list', (req, res) => {
    res.render('emp_list.hbs', {
        title: "Employee List",
        uri: "/emp/list"
    });
});

module.exports = router;