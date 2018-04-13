/**
 * Smart Trash Bin Web Application
 * - An LBY-IOT Project
 * 
 * Author: Allendale Nato <natoallendale@gmail.com>
 */

// Dependencies
const express       = require('express');
const socket        = require('./socket');
const hbs           = require('hbs');
// MQTT Live-Data
const mqtt          = require('./mqtt_sub');
// Express Router
const bin_route     = require('./routes/bin_route');
const emp_route     = require('./routes/employee_route');
// Web App Port #
const port = 3000;

const app = express();
const server = require('http').createServer(app);
const realTimeSocket = socket.listen(server);

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/scripts', express.static(__dirname + '/bower_components'));
app.use('/dashboard', express.static(__dirname + '/views'));

app.use('/smart-trash/bin', bin_route);
app.use('/smart-trash/emp', emp_route);

app.get('/smart-trash', (req, res) => {
    res.send('home_dash.hbs');
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
    mqtt.manageMQTTData('mqtt://192.168.1.3', 'smart-trash', realTimeSocket);
    
});