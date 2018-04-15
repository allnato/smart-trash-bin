const conn = require('./db_connect');

function getAverageTrashCurrentWeek() {
    conn.query(`
        SELECT avg(waste_height) AS waste_height
        FROM sensor_data
        WHERE week(data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2);
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getAverageTrashCurrentWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getAverageTrashPerWeek() {
    conn.query(`
        SELECT avg(waste_height) AS waste_height, 
        week(data_timestamp, 2) AS week, 
        monthname(data_timestamp) AS month, year(data_timestamp) AS year
        FROM sensor_data
        WHERE month(data_timestamp) = month(CURRENT_TIMESTAMP)
        GROUP BY week
        ORDER BY week;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getAverageTrashPerWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getTopTenMostTrashCurrentWeek() {
    conn.query(`
        SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height
        FROM (
        SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
        AND sd.waste_height != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        ORDER BY waste_height DESC
        LIMIT 10;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getTopTenMostTrashCurrentWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getMostTrashPerWeek() {
    conn.query(`
        SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height, 
        week, month, month_name, year
        FROM (
        SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height, 
        week(sd.data_timestamp, 2) AS week, month(sd.data_timestamp) 
        AS month, monthname(sd.data_timestamp) AS month_name, 
        year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
        AND sd.waste_height != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        GROUP BY week
        ORDER BY week;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getMostTrashPerWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getTopTenMostHumidCurrentWeek() {
    conn.query(`
        SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity
        FROM (
        SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
        AND sd.humidity != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        ORDER BY humidity DESC
        LIMIT 10;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getTopTenMostHumidCurrentWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    }) 
}

function getMostHumidPerWeek() {
    conn.query(`
        SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity, 
        week, month, month_name, year
        FROM (
        SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity, 
        week(sd.data_timestamp, 2) AS week, month(sd.data_timestamp) 
        AS month, monthname(sd.data_timestamp) AS month_name, 
        year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
        AND sd.humidity != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        GROUP BY week
        ORDER BY week;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getMostHumidPerWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getTrashPeakDayCurrentWeek() {
    conn.query(`
        SELECT day(sd.data_timestamp) AS day, 
        max(sd.waste_height) AS waste_height, dayname(sd.data_timestamp) AS weekday
        FROM sensor_data sd, bin b
        WHERE week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
        AND sd.waste_height > (b.height * 0.75);
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getTrashPeakDayCurrentWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getTrashPeakDayPerWeek() {
    conn.query(`
        SELECT day(sd.data_timestamp) AS day, max(sd.waste_height) AS waste_height,
        dayname(sd.data_timestamp) AS weekday, week(sd.data_timestamp, 2) AS week
        FROM sensor_data sd, bin b
        WHERE month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
        AND sd.waste_height > (b.height * 0.75)
        GROUP BY week
        ORDER BY week;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getTrashPeakDayPerWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getTopTenMostCleaningEmployeeCurrentWeek() {
    conn.query(`
        SELECT e.employee_id, e.first_name, e.last_name, 
        count(ea.activity_timestamp) AS times_cleaned
        FROM employee e, employee_activity ea
        WHERE week(ea.activity_timestamp) = week(CURRENT_TIMESTAMP)
        AND e.employee_id = ea.employee_id
        GROUP BY ea.employee_id
        ORDER BY times_cleaned DESC
        LIMIT 10;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getTopTenMostCleaningEmployeeCurrentWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getMostCleaningEmployeePerWeek() {
    conn.query(`
        SELECT dt.employee_id, dt.first_name, dt.last_name, 
        max(clean_count) AS times_cleaned, week
        FROM (
        SELECT count(ea.activity_timestamp) AS clean_count, e.employee_id,
        e.first_name AS first_name, e.last_name AS last_name,
        week(ea.activity_timestamp, 2) AS week
        FROM employee e, employee_activity ea
        WHERE month(ea.activity_timestamp) = month(CURRENT_TIMESTAMP)
        AND e.employee_id = ea.employee_id
        GROUP BY ea.employee_id
        ) AS dt
        GROUP BY week
        ORDER BY week;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getMostCleaningEmployeePerWeek: ${err.messsage}`);
            return;
        }

        console.log(res);
        return res;
    })
}

module.exports = {
    getAverageTrashCurrentWeek,
    getAverageTrashPerWeek,
    getAverageTrashCurrentWeek,
    getAverageTrashPerWeek,
    getTopTenMostTrashCurrentWeek,
    getMostTrashPerWeek,
    getTopTenMostHumidCurrentWeek,
    getMostHumidPerWeek,
    getTrashPeakDayCurrentWeek,
    getTrashPeakDayPerWeek,
    getTopTenMostCleaningEmployeeCurrentWeek,
    getMostCleaningEmployeePerWeek
}
