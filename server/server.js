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

// Express Router
const smart_trash   = require('./routes/smart_trash_bin');
// Web App Port #
const port = 3000;

const app = express();
const server = require('http').createServer(app);
const io = socket.listen(server);

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/scripts', express.static(__dirname + '/bower_components'));
app.use('/SmartTrash', smart_trash);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});