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
            console.log(`Error connecting to DB: ${err.message}` );
            process.exit();
        }
        console.log(`Connected to DB: ${conn.config.database}`);
    });
}



mysqlConnect();

module.exports = conn;