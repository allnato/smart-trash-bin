const mqtt_pub = require('./mqtt_publisher')
let client = mqtt_pub('mqtt://192.168.1.3');

client.on('message', (topic, message) => {
    console.log(topic, message.toString());
});

client.publish('smart-trash', 'penis');
