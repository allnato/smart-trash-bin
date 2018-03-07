const mqtt_pub = require('./mqtt_publisher');
let client = mqtt_pub('mqtt://192.168.1.2');


client.on('message', (topic, message) => {
    console.log(topic, message.toString());
});


