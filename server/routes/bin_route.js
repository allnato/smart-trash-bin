const express   = require('express');
const router    = express.Router();

const q_all     = require('./../db/all_query');
const q_month   = require('./../db/monthly_query');
const q_year    = require('./../db/yearly_query');

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
    Promise.all([
        q_month.getAverageTrashCurrentMonth(),
        q_month.getAverageTrashPerMonth(),
        q_month.getTopTenMostTrashCurrentMonth(),
        q_month.getMostTrashPerMonth(),
        q_month.getTopTenMostHumidCurrentMonth(),
        q_month.getMostHumidPerMonth(),
        q_month.getTrashPeakDayCurrentMonth(),
        q_month.getTrashPeakDayPerMonth()
    ])
    .then(data => {
        res.render('bin_monthly.hbs', {
            title: "Smart Bin Monthly Data",
            uri: "/bin/monthly",
            data: {
                averageTrashCurrent: data[0],
                averageTrashMonthly: data[1],
                topTenMostTrashCurrent: data[2],
                mostTrashMonthly: data[3],
                topTenMostHumidCurrent: data[4],
                mostHumidMonthly: data[5],
                trashPeakDayCurrent: data[6],
                trashPeakDayMonthly: data[7]
            }
        });
    })
    .catch(err => {
        res.status(500);
        res.send(`Internal Server Error: ${err}`);
    });
});

// Bin Yearly
router.get('/yearly', (req, res) => {
    Promise.all([
        q_year.getAverageTrashCurrentYear(),
        q_year.getAverageTrashPerYear(),
        q_year.getTopTenMostTrashCurrentYear(),
        q_year.getMostTrashPerYear(),
        q_year.getTopTenMostHumidCurrentYear(),
        q_year.getMostHumidPerYear(),
        q_year.getTrashPeakDayCurrentYear(),
        q_year.getTrashPeakDayPerYear()
    ])
    .then(data => {
        res.render('bin_yearly.hbs', {
            title: "Smart Bin Yearly Data",
            uri: "/bin/yearly",
            data: {
                averageTrashCurrent: data[0],
                averageTrashYearly: data[1],
                topTenMostTrashCurrent: data[2],
                mostTrashYearly: data[3],
                topTenMostHumidCurrent: data[4],
                mostHumidYearly: data[5],
                trashPeakDayCurrent: data[6],
                trashPeakDayYearly: data[7]
            }
        });
    })
    .catch(err => {
        res.status(500);
        res.send(`Internal Server Error: ${err}`);
    });
});

module.exports = router;