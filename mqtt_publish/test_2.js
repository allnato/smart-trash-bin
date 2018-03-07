const mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.1.2');

client.on('connect', con => {
    console.log('Connected');
});

client.on('offline', () => {
    console.log(`Cannot connect to broker`);
    console.log('MQTT client is now offline');
    client.end();
});

client.on('end', () => {
    console.log('Closing MQTT client');
});