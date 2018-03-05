const SerialPort = require('serialport');
const xbee_api = require('xbee-api');
const XBee = new xbee_api.XBeeAPI({
    api_mode: 1
});

const StringDecoder = require('string_decoder').StringDecoder;
let decoder = new StringDecoder('utf8');
let msg = "";
// Initialize Serial Port
const port = new SerialPort('COM6', {
    autoOpen: false,
    baudRate: 9600,
    parser: XBee.rawParser()
});

// Open Serial Port
port.open(err => {
    if (err) {
        console.log("ERROR opening port:", err.message);
        process.exit();
    }
});

port.on('data', buffer => {
    msg = msg + buffer.toString('utf8');
    try {
        let obj = JSON.parse(msg);
        console.log(obj);
        msg = "";
    } catch (err) {
        
    }
})

