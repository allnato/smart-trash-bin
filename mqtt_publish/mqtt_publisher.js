var mqtt = require('mqtt');
let client;

/**
 * Connect to a MQTT Broker
 * @param {String} broker broker url with protocol (ex. mqtt://192.168.1.1)
 */
const connect = (broker='mqtt://localhost') => {
    client = mqtt.connect(broker, {
        connectTimeout: 5000
    });
    
    // Handle Connection Error
    client.on('error', err => {
        console.log(`Error in ${broker}: ${err}`);
    });
    
    client.on('connect', con => {
        console.log(`Connected to MQTT broker: ${broker}`);
    });

    client.on('offline', () => {
        console.log(`MQTT client is now offline: Cannot connect to broker: ${broker}`);
        client.end();
    });

    client.on('end', () => {
        console.log('Closing MQTT client');
    });
};

/**
 * Publish a MQTT message
 * @param {String} topic the topic to publish to.
 * @param {String} msg  the message to publish
 */
const publishMessage = (topic, msg) => {
    if (client == undefined) {
        console.log('Error: Cannot publish - MQTT client is undefined');
        return;
    }

    client.publish(topic, msg, err => {
        if (err) {
            console.log('Error publishing message');
            return;
        }
    });
};

module.exports = {
	connect,
	publishMessage
};
