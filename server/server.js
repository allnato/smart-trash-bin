/**
 * Smart Trash Bin Web Application
 * - An LBY-IOT Project
 * 
 * Author: Allendale Nato <natoallendale@gmail.com>
 */

// Dependencies
const express       = require('express');
const hbs           = require('hbs');

// Router
const smart_trash   = require('./routes/smart_trash_bin');

// Web App Port #
const port = 3000;


let server = express();
server.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

server.use('/scripts', express.static(__dirname + '/bower_components'));
server.use('/SmartTrash', smart_trash);
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});