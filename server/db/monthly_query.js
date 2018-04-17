const conn = require('./db_connect');

function getAverageTrashCurrentMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT avg(waste_height) AS waste_height
        FROM sensor_data
        WHERE month(data_timestamp) = month(CURRENT_TIMESTAMP);
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getAverageTrashCurrentMonth:${err.message}`)
                reject();
            }
            resolve (res);
        });
    });
}

function getAverageTrashPerMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT avg(waste_height) AS waste_height, 
        month(data_timestamp) AS month, 
        monthname(data_timestamp) AS month_name, year(data_timestamp) AS year
        FROM sensor_data
        WHERE year(data_timestamp) = year(CURRENT_TIMESTAMP)
        GROUP BY month
        ORDER BY month;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getAverageTrashPerMonth:${err.message}`)
                reject();
            }
            resolve (res);
        });
    });
}

function getTopTenMostTrashCurrentMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, dt.name AS bin_name, dt_waste_height AS waste_height
        FROM (
        SELECT b.bin_id, b.name, max(sd.waste_height) AS dt_waste_height
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
        AND sd.waste_height != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        ORDER BY waste_height DESC
        LIMIT 10;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at :${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

function getMostTrashPerMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, bin_name, dt_waste_height AS waste_height, 
        month, month_name, year
        FROM (
        SELECT b.bin_id, b.name AS bin_name, max(sd.waste_height) AS dt_waste_height, 
        month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) 
        AS month_name, year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
        AND sd.waste_height != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        GROUP BY month
        ORDER BY month;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getMostTrashPerMonth:${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

function getTopTenMostHumidCurrentMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, dt.name AS bin_name, dt_humidity AS humidity
        FROM (
        SELECT b.bin_id, b.name, max(sd.humidity) AS dt_humidity
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
        AND sd.humidity != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        ORDER BY humidity DESC
        LIMIT 10;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTopTenMostHumidCurrentMonth:${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

function getMostHumidPerMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.bin_id, bin_name, dt_humidity AS humidity, month, month_name, year
        FROM (
        SELECT b.bin_id, b.name AS bin_name, max(sd.humidity) AS dt_humidity, 
        month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) 
        AS month_name, year(sd.data_timestamp) AS year
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        AND year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
        AND sd.humidity != 0
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        GROUP BY month
        ORDER BY month;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getMostHumidPerMonth:${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

function getTrashPeakDayCurrentMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT week, max(ctr_waste_height) AS peak_waste_count
        FROM (
        SELECT week(sd.data_timestamp) AS week, count(sd.waste_height) AS ctr_waste_height
        FROM sensor_data sd, bin b
        WHERE month(sd.data_timestamp) = month(CURRENT_TIMESTAMP)
        AND sd.waste_height > (b.height * 0.75)
        GROUP BY day(sd.data_timestamp)
        ) AS dt;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTrashPeakDayCurrentMonth:${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

function getTrashPeakDayPerMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT week, max(ctr_waste_height) AS peak_waste_count, month, month_name
        FROM (
        SELECT week(sd.data_timestamp) AS week, count(sd.waste_height) AS ctr_waste_height,
        month(sd.data_timestamp) AS month, monthname(sd.data_timestamp) AS month_name
        FROM sensor_data sd, bin b
        WHERE year(sd.data_timestamp) = year(CURRENT_TIMESTAMP)
        AND sd.waste_height > (b.height * 0.75)
        GROUP BY day(sd.data_timestamp)
        ) AS dt
        GROUP BY month
        ORDER BY month;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTrashPeakDayPerMonth:${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

function getTopTenMostCleaningEmployeeCurrentMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT e.employee_id, e.first_name, e.last_name, 
        count(ea.activity_timestamp) AS times_cleaned
        FROM employee e, employee_activity ea
        WHERE month(ea.activity_timestamp) = month(CURRENT_TIMESTAMP)
        AND e.employee_id = ea.employee_id
        ORDER BY times_cleaned DESC
        LIMIT 10;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getTopTenMostCleaningEmployeeCurrentMonth:${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

function getMostCleaningEmployeePerMonth() {
    return new Promise((resolve, reject) => {
        conn.query(
        `
        SELECT dt.employee_id, dt.first_name, dt.last_name, 
        max(clean_count) AS times_cleaned, month
        FROM (
        SELECT count(ea.activity_timestamp) AS clean_count, e.employee_id,
        e.first_name AS first_name, e.last_name AS last_name,
        month(ea.activity_timestamp) AS month
        FROM employee e, employee_activity ea
        WHERE year(ea.activity_timestamp) = year(CURRENT_TIMESTAMP)
        AND e.employee_id = ea.employee_id
        GROUP BY month(ea.activity_timestamp)
        ) AS dt
        GROUP BY month
        ORDER BY month;
        `,
        (err,res,field) => {
            if (err) {
                console.log(`Error at getMostCleaningEmployeePerMonth:${err.message}`)
                reject();
            }
            resolve(res);
        });
    });
}

module.exports = {
    getAverageTrashCurrentMonth,
    getAverageTrashPerMonth,
    getTopTenMostTrashCurrentMonth,
    getMostTrashPerMonth,
    getTopTenMostHumidCurrentMonth,
    getMostHumidPerMonth,
    getTrashPeakDayCurrentMonth,
    getTrashPeakDayPerMonth,
    getTopTenMostCleaningEmployeeCurrentMonth,
    getMostCleaningEmployeePerMonth,
};