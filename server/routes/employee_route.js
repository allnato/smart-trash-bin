const express   = require('express');
const router     = express.Router();

const q_all     = require('./../db/all_query');
const q_month   = require('./../db/monthly_query');
const q_year    = require('./../db/yearly_query');

// Real-time Employee Activity
router.get('/real-time', (req, res) => {
    q_all.getEmployeeActivityList()
        .then(data => {
            res.render('real_time_activity.hbs', {
                title: "Employee Real-Time Activity Tracker",
                uri: "/emp/real-time",
                list: data
            });
        })
        .catch(err => {
            res.status(500);
            res.send('Internal Server Error');
        });
});

router.get('/list', (req, res) => {
    q_all.getAllEmployeeData()
        .then(data => {
            res.render('emp_list.hbs', {
                title: "Employee List",
                uri: "/emp/list",
                list: data
            });
        })
        .catch(err => {
            res.status(500);
            res.send('Internal Server Error');
        });
});

router.get('/weekly', (req, res) => {
    res.render('emp_weekly.hbs', {
        title: "Employee Weekly Data",
        uri: "/emp/weekly"
    });
});

router.get('/monthly', (req, res) => {
    Promise.all([
        q_month.getTopTenMostCleaningEmployeeCurrentMonth(),
        q_month.getMostCleaningEmployeePerMonth()
    ])
    .then(data => {
        res.render('emp_monthly.hbs', {
            title: "Employee Monthly Data",
            uri: "/emp/monthly",
            data: {
                topTenEmployee: data[0],
                bestEmployeePerMonth: data[1]
            }
        });
    })
    .catch(err => {
        res.status(500);
        res.send(`Internal Server Error: ${err}`);
    });
});

router.get('/yearly', (req, res) => {
    Promise.all([
        q_year.getTopTenMostCleaningEmployeeCurrentYear(),
        q_year.getMostCleaningEmployeePerYear()
    ])
    .then(data => {
        res.render('emp_yearly.hbs', {
            title: "Employee Yearly Data",
            uri: "/emp/yearly",
            data: {
                topTenEmployee: data[0],
                bestEmployeePerYear: data[1]
            }
        });
    })
    .catch(err => {
        res.status(500);
        res.send(`Internal Server Error: ${err}`);
    });
});

module.exports = router;