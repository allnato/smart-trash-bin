const socketio = require('socket.io');

module.exports.listen = server => {
    var io = socketio.listen(server, {
        serveClient: false
    });

    io.of('/real-time-data').on('connection', socket => {
        console.log('socketio: ', 'a user connected');
        socket.on('disconnect', () => {
            console.log('socketio: ', 'a user disconnected');
        })
    });

    return io;
};