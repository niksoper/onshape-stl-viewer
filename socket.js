const io = require('socket.io-client');

const socket = io('https://niksoper-future-joinery-api.eu.ngrok.io')

socket.on('connection', () => console.log('Got socket.io connection!'))

function send(data) {
  socket.emit('onshape', data)
}

module.exports = send
