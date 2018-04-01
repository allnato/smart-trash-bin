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

publishSerialData('COM7', 'mqtt://10.200.180.13', 'smart-trash');