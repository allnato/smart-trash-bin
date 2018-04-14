const moment = require('moment');
const mysql = require('mysql');

// Create MYSQL connection instance.
let conn = mysql.createConnection({
    host            : 'localhost',
    user            : 'root',
    password        : 'admin123',
    database        : 'trash',
    connectTimeout  : 5000
});

// Establish MYSQL Connection.
function mysqlConnect() {
    conn.connect(err => {
        if (err) {
            console.log(`[${moment().format('HH:mm:ss')}] Cannot connect to MySQL Database: ${err.message}`);                
            process.exit();
        }
        console.log(`[${moment().format('HH:mm:ss')}] Connected to MySQL Database: ${conn.config.database}`);        
    });
}



mysqlConnect();

module.exports = conn;