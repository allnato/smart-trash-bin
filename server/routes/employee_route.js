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

router.get('/weekly', (req, res) => {
    res.render('emp_weekly.hbs', {
        title: "Employee Weekly Data",
        uri: "/emp/weekly"
    });
});

router.get('/monthly', (req, res) => {
    res.render('emp_monthly.hbs', {
        title: "Employee Monthly Data",
        uri: "/emp/monthly"
    });
});

router.get('/yearly', (req, res) => {
    res.render('emp_yearly.hbs', {
        title: "Employee Yearly List",
        uri: "/emp/yearly"
    });
});

module.exports = router;