const moment = require('moment');
const mqtt = require('./../mqtt/mqtt_connect');
const broadcastData = require('./socket').broadcastData;

/**
 * Connect to a MQTT Broker and Broadcast the data recieved to the client socket.
 * @param {string} broker broker url with protocol (ex. mqtt://192.168.1.1)
 * @param {string} topic the topic to subscribe to
 * @param {<socket.io> Object} socket a socket.io instance
 */
async function manageMQTTData(brokerAddr, topic, socket) {
    // Establish a connection to the provided MQTT broker
    try {
        let mqttClient = await mqtt.connectMQTT(brokerAddr);
        mqttClient.subscribe(topic);
        // Execute the following code upon recieving a msg.
        mqttClient.on('message', (topic, msg) => {
            console.log(msg.toString());
            broadcastData(socket, msg);
        });
    // Log MQTT connection error.
    } catch (err) {
        console.log(`[${moment().format('HH:mm:ss')}] Error in node and broker intercomm: ${err.message}`);
    }
};


module.exports = {manageMQTTData};