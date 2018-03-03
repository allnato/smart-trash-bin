const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const xbee_api = require('xbee-api');


let msg = "";

// Initialize Serial Port
const port = new SerialPort('COM6', {
    autoOpen: false,
    baudRate: 9600
});

const parser = port.pipe(new Readline({ delimiter: ':' }));


// Open Serial Port
port.open(err => {
    if (err) {
        console.log("ERROR opening port:", err.message);
        process.exit();
    }
});

port.on('data', buffer => {
    msg = buffer.toString('utf8');
    console.log(msg);
})

