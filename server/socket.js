const socketio = require('socket.io');

let io;
let realTimeRoute;

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

exports.realTimeRoute = realTimeRoute;