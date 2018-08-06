const socket = require("socket.io");

var communityDict = {

}

module.exports = function(server) {

  var io = socket(server);

  var chatroomIO = io.of('/chat');

  chatroomIO.on('connection', socket => {

    //Client emits when joining a community room
    socket.on("join", (pack) => {
      //Join the client socket to the community room, so message sent in the room will only be received by client in the room.
      socket.join(pack.community_id, () => {

      });
    });

    socket.on("message", (msg) => {
      console.log(msg);
      //Sent the message only to client that join the community
      chatroomIO.to(msg.community).emit('message', msg);
    });

  });
}
