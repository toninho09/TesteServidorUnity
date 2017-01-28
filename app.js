var server = require('http').createServer();
var io = require('socket.io')(server);
io.engine.ws = new (require('uws').Server)({
    noServer: true,
    perMessageDeflate: false
});
var clientes = 0;
var players = [];

function Player() {
    this.id;
    this.position = {
        x: 0,
        y: 0,
        z: 0
    }
    this.rotate = {
        w:0,
        x:0,
        y:0,
        z:0
    }
}
io.on('connection', function (client) {
    var userId = ++clientes;
    console.log("conectou");
    client.on('updatePlayer', function (data) {
        console.log(data);
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == userId) {
                players[i] = data;
            }
        }
    })

    client.on('disconnect', function () {
        console.log("Desconectou");
        for (var i = players.length - 1; i > 0; i--) {
            if (players[i].id == userId) {
                players.splice(i, 1);
            }
        }
    });

    client.on('register', function (data) {

        client.emit("register", {id: userId});
    });

    var player = new Player();
    player.id = userId;
    players.push(player);
    client.emit("register", {id: userId});
});
setInterval(function () {
    io.emit('sync', {players: players});
    console.log("sincronizando");
}, 1000/30);

server.listen(4000, function () {
    console.log("Servidor rodando na porta 4000");
});