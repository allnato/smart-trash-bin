const moment = require('moment');
const mqtt = require('./../mqtt/mqtt_connect');
const broadcastData = require('./socket').broadcastData;

const insert = require('./db/insert_data');

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
            try {
                let jsonData = JSON.parse(msg);
                broadcastData(socket, msg);
                // Store data in db
                if (jsonData.dataType == 'sensor') {
                    insert.sensorData(jsonData);
                } else if (jsonData.dataType == 'activity'){
                    insert.empActivity(jsonData)
                }
            } catch (err) {
                console.log(`[${moment().format('HH:mm:ss')}] Error parsing recieved MQTT data: ${err.message}`);
            }

        });
    // Log MQTT connection error.
    } catch (err) {
        console.log(`[${moment().format('HH:mm:ss')}] Error in node and broker intercomm: ${err.message}`);
    }
};


module.exports = {manageMQTTData};