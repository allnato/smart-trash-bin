const socketio = require('socket.io');
const moment = require('moment');

exports.listen = server => {
    io = socketio.listen(server);

    realTimeRoute = io.of('/real-time-data');

    realTimeRoute.on('connection', socket => {
        console.log('socketio: ', 'a user connected');

        // On Disconnect
        socket.on('disconnect', () => {
            console.log('socketio: ', 'a user disconnected');
        })
    });

    return realTimeRoute;
};

exports.broadcastData = (socket, msg) => {
    // Check if message is a valid JSON data
    try {
        let jsonData = JSON.parse(msg);
        socket.clients((err, clients) => {
            if (clients.length > 0 && jsonData.dataType == 'sensor') {
                socket.emit('real-time-data', jsonData);
            }
        });
        // Perform DB Ops here
        
    // Log JSON parse error
    } catch (err) {
        console.log(`[${moment().format('HH:mm:ss')}] Error parsing recieved MQTT data: ${err.message}`);
        console.log(toString(msg));
    }
};