const mqtt = require('mqtt');

module.exports = (broker='mqtt://localhost') => {
    let client = mqtt.connect(broker, {
        connectTimeout: 1000
    });
    
    // Handle Connection Error
    client.on('error', err => {
        console.log(`Error: Cannot connect to MQTT broker ${broker}`);
        console.log(err.message);
    });

    client.on('connect', con => {
        console.log(`Connected to MQTT broker: ${broker}`);
        client.subscribe('smart-trash')
    })

    return client;
};