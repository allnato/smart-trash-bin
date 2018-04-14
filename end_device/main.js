const moment = require('moment');

const Serial = require('./serial_port');
const MQTTpub = require('./../mqtt/mqtt_connect');

let port;
let mqttClient;

async function publishSerialData(serialport, brokerAddr, topic) {
    try {
        // Open Serial Port
        port = await Serial.connectPort(serialport);

        // Establish Connection to MQTT Broker
        mqttClient = await MQTTpub.connectMQTT(brokerAddr);
        
        port.on('readable', () => {
            let msg = port.read().toString();
            mqttClient.publish(topic, msg);
            console.log(msg);
        })
    } catch (err) {
        console.log(`[${moment().format('HH:mm:ss')}] Error in node and broker intercomm: ${err.message}`);
        process.exit();
    }
};

publishSerialData('COM8', 'mqtt://192.168.1.7', 'smart-trash');