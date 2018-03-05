const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

// Initialize Serial Port
const port = new SerialPort('COM8', {
    autoOpen: false,
    baudRate: 9600
});
const parser = port.pipe(new Readline());


// Open Serial Port
port.open(err => {
    if (err) {
        console.log("ERROR opening port:", err.message);
        process.exit();
    }
});

// On Open (Serial Port): Read Data
port.on('open', () => {
    parser.on('readable', function () {
        let msg = parser.read().toString();
        // Convert to JSON upon reading buffer stream
        try {
            let json = JSON.parse(msg);
            console.log(json);
        } catch (err) {
            console.log('serial_comm: ', 'Error parsing data to JSON');
        }
    });
});
