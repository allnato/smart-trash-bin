const conn = require('./db_connect');

function getTotalTrashCurrentWeek(binID) {
    conn.query(`
        SELECT sum(waste_height) AS waste_height
        FROM sensor_data
        WHERE week(data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
        AND bin_id = ${binID};
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getTotalTrashCurrentWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getTotalTrashPerWeek(binID) {
    conn.query(`
        SELECT sum(waste_height) AS waste_height, 
        week(data_timestamp, 2) AS week, 
        monthname(data_timestamp) AS month, year(data_timestamp) AS year
        FROM sensor_data
        WHERE bin_id = ${binID}
        AND month(data_timestamp) = month(CURRENT_TIMESTAMP)
        GROUP BY week
        ORDER BY week;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getTotalTrashPerWeek: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

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
        SELECT b.bin_id, b.name AS bin_name, sd.waste_height
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
        ORDER BY sd.waste_height DESC
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
        SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS waste_height, 
        week(sd.data_timestamp, 2) AS week, 
        monthname(sd.data_timestamp) AS month, year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
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
        SELECT b.bin_id, b.name AS bin_name, sd.humidity
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND week(sd.data_timestamp, 2) = week(CURRENT_TIMESTAMP, 2)
        ORDER BY sd.humidity DESC
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
        SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) as humidity, 
        week(sd.data_timestamp, 2) AS week, 
        monthname(sd.data_timestamp) AS month, year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
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
        GROUP BY day(ea.activity_timestamp)
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
    getTotalTrashCurrentWeek,
    getTotalTrashPerWeek,
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
