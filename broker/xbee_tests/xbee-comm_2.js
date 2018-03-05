const SerialPort = require('serialport');
const Delimeter = SerialPort.parsers.Delimiter;

// Initialize Serial Port
const port = new SerialPort('COM8', {
    autoOpen: false,
    baudRate: 9600
});
const parser = port.pipe(new Delimeter({delimiter: '}'}));


// Open Serial Port
port.open(err => {
    if (err) {
        console.log("ERROR opening port:", err.message);
        process.exit();
    }
});

port.on('open', () => {
    // Switches the port into "flowing mode"
    parser.on('readable', function () {
        console.log(parser.read().toString());
    });
})
