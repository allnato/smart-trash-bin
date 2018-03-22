const moment = require('moment');

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

/**
 * @param {string} portName name of the port to be opened
 * @returns {Promise} a SerialPort object
 */
const connectPort = portName => {
    return new Promise ((resolve, reject) => {
        let port = new SerialPort(portName, {
            autoOpen: false,
            baudRate: 115200
        });

        port.open(err => {
            if (err) {reject(err)};
        })

        port.on('open', () => {
            console.log(`[${moment().format('HH:mm:ss')}] Opened ${portName} serial port`);
            resolve(port.pipe(new Readline()));
        });
    });
};


module.exports = {
    connectPort
};