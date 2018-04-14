const conn = require('./db_connect');

function getAllBinData() {
    conn.query(`
        SELECT b.bin_id, b.name 
            AS bin_name, b.height AS bin_height, l.address, l.city, l.state
        FROM bin b, location l
        WHERE b.location_id = l.location_id;
     `, (err, res, field) => {
        if(err) {
            console.log(`Error at getAllBinData: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    });
}

function getAllEmployeeData() {
    conn.query(`
        SELECT employee_id, first_name, last_name, occupation
        FROM employee
        ORDER BY employee.last_name;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getAllEmployeeData: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getAllEmployeeActivityData() {
    conn.query(`
        SELECT e.employee_id, e.first_name, e.last_name, 
        b.name AS cleaned_bin, ea.activity_timestamp 
        FROM bin b, employee e, employee_activity ea
        WHERE b.bin_id = ea.bin_id 
        AND ea.employee_id = e.employee_id
        ORDER BY ea.activity_timestamp;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getAllEmployeeActivityData: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

function getAllSensorData() {
    conn.query(`
        SELECT sd.data_id, b.name AS bin_name, 
        sd.waste_height, sd.temperature, 
        sd.humidity, sd.is_open AS lid_status, sd.data_timestamp
        FROM bin b, sensor_data sd
        WHERE b.bin_id = sd.bin_id
        ORDER BY sd.data_timestamp;
    `, (err, res, field) => {
        if(err) {
            console.log(`Error at getAllSensorData: ${err.message}`);
            return;
        }

        console.log(res);
        return res;
    })
}

module.exports = {
    getAllBinData,
    getAllEmployeeData,
    getAllEmployeeActivityData,
    getAllSensorData
}