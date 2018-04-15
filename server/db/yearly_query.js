const conn = require('./db_connect');

function getAverageTrashCurrentYear() {
    conn.query(
    `
    SELECT avg(waste_height) AS waste_height
    FROM sensor_data
    WHERE year(data_timestamp) = year(CURRENT_TIMESTAMP);
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getAverageTrashCurrentYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getAverageTrashPerYear() {
    conn.query(
    `
    SELECT avg(waste_height) AS waste_height, 
    year(data_timestamp) AS year
    FROM sensor_data
    GROUP BY year
    ORDER BY year;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getAverageTrashPerYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getTopTenMostTrashCurrentYear() {
    conn.query(
    `
    SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height
    FROM (
    SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height
    FROM bin b, sensor_data sd
    WHERE b.bin_id = sd.bin_id
    AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
    AND sd.waste_height != 0
    GROUP BY day(sd.data_timestamp)
    ) AS dt
    ORDER BY waste_height DESC
    LIMIT 10;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getTopTenMostTrashCurrentYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getMostTrashPerYear() {
    conn.query(
    `
    SELECT dt.bin_id, bin_name, max(dt_waste_height) AS waste_height, year
    FROM (
    SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS dt_waste_height, 
    (year(sd.data_timestamp) * 1000) + day(sd.data_timestamp) AS year_day,
    year(sd.data_timestamp) AS year
    FROM bin b, sensor_data sd
    WHERE b.bin_id = sd.bin_id
    AND sd.waste_height != 0
    GROUP BY year_day
    ) AS dt
    GROUP BY year
    ORDER BY year;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getMostTrashPerYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getTopTenMostHumidCurrentYear() {
    conn.query(
    `
    SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity
    FROM (
    SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity
    FROM bin b, sensor_data sd
    WHERE b.bin_id = sd.bin_id
    AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
    AND sd.humidity != 0
    GROUP BY day(sd.data_timestamp)
    ) AS dt
    ORDER BY humidity DESC
    LIMIT 10;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getTopTenMostHumidCurrentYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getMostHumidPerYear() {
    conn.query(
    `
    SELECT dt.bin_id, bin_name, max(dt_humidity) AS humidity, year
    FROM (
    SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) AS dt_humidity, 
    (year(sd.data_timestamp) * 1000) + day(sd.data_timestamp) AS year_day,
    year(sd.data_timestamp) AS year
    FROM bin b, sensor_data sd
    WHERE b.bin_id = sd.bin_id
    AND sd.humidity != 0
    GROUP BY year_day
    ) AS dt
    GROUP BY year
    ORDER BY year;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getMostHumidPerYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getTrashPeakDayCurrentYear() {
    conn.query(
    `
    SELECT day, max(ctr_waste_height) AS peak_waste_count
    FROM (
    SELECT day(sd.data_timestamp) AS day, count(sd.waste_height) AS ctr_waste_height,
    (year(sd.data_timestamp) * 1000) + day(sd.data_timestamp) AS year_day
    FROM sensor_data sd, bin b
    WHERE year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
    AND sd.waste_height > (b.height * 0.75)
    GROUP BY year_day
    ) AS dt;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getTrashPeakDayCurrentYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getTrashPeakDayPerYear() {
    conn.query(
    `
    SELECT day, max(ctr_waste_height) AS peak_waste_count, year
    FROM (
    SELECT day(sd.data_timestamp) AS day, year(sd.data_timestamp) AS year,
    count(sd.waste_height) AS ctr_waste_height,
    (year(sd.data_timestamp) * 1000) + day(sd.data_timestamp) AS year_day
    FROM sensor_data sd, bin b
    WHERE sd.waste_height > (b.height * 0.75)
    GROUP BY year_day
    ) AS dt
    GROUP BY year
    ORDER BY year;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getTrashPeakDayPerYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getTopTenMostCleaningEmployeeCurrentYear() {
    conn.query(
    `
    SELECT e.employee_id, e.first_name, e.last_name, 
    count(ea.activity_timestamp) AS times_cleaned
    FROM employee e, employee_activity ea
    WHERE year(ea.activity_timestamp) = year(CURRENT_TIMESTAMP)
    AND e.employee_id = ea.employee_id
    GROUP BY ea.employee_id
    ORDER BY times_cleaned DESC
    LIMIT 10;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getTopTenMostCleaningEmployeeCurrentYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

function getMostCleaningEmployeePerYear() {
    conn.query(
    `
    SELECT dt.employee_id, dt.first_name, dt.last_name, 
    max(clean_count) AS times_cleaned, year
    FROM (
    SELECT count(ea.activity_timestamp) AS clean_count, e.employee_id,
    e.first_name AS first_name, e.last_name AS last_name,
    year(ea.activity_timestamp) AS year
    FROM employee e, employee_activity ea
    WHERE e.employee_id = ea.employee_id
    GROUP BY ea.employee_id
    ) AS dt
    GROUP BY year
    ORDER BY year;
    `,
    (err,res,field) => {
        if (err) {
            console.log(`Error at getMostCleaningEmployeePerYear:${err.message}`)
            return;
        }
        console.log(res);
        return res;
    });
}

module.exports = {
    getAverageTrashCurrentYear,
    getAverageTrashPerYear,
    getTopTenMostTrashCurrentYear,
    getMostTrashPerYear,
    getTopTenMostHumidCurrentYear,
    getMostHumidPerYear,
    getTrashPeakDayCurrentYear,
    getTrashPeakDayPerYear,
    getTopTenMostCleaningEmployeeCurrentYear,
    getMostCleaningEmployeePerYear,
};