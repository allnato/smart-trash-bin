const moment = require('moment');
const mqtt = require('mqtt');
let client;

/**
 * Connect to a MQTT Broker
 * @param {String} broker broker url with protocol (ex. mqtt://192.168.1.1)
 */
const connectMQTT = (broker='mqtt://localhost') => {
    return new Promise((resolve, reject) => {
        try {
            client = mqtt.connect(broker, {
                connectTimeout: 5000
            });
            
            // Error Event
            client.on('error', err => {
                console.log(`[${moment().format('HH:mm:ss')}] Error in ${broker}: ${err}`);
            });

            // Offline Event
            client.on('offline', () => {
                client.end();
                reject(new Error(`MQTT client is now offline: ${broker}`));
            });

            // End Event
            client.on('end', () => {
                console.log(`[${moment().format('HH:mm:ss')}] Closing MQTT client`);
            });

            // Connected Event
            client.on('connect', con => {
                console.log(`[${moment().format('HH:mm:ss')}] Connected to MQTT broker: ${broker}`);
                resolve(client);
            });
        } catch (err) {
            reject(err);
        }
    });
};


module.exports = {
	connectMQTT
};
