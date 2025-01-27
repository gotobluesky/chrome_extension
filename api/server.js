const express = require("express");
const cors = require("cors");
const app = express();

let broadcaster;
const port = 4000;

const http = require("http");
const server = http.createServer(app);

// const io = require("socket.io")(server);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    allowedHeaders: ["authorization"]
  },
  addTrailingSlash: false 
});
app.use(cors({
  origin: "https://allpanelexch.com/"
}))
app.use(express.static(__dirname + "/public"));
app.get('/', function(req, res) {
  res.render('index.html');
});

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });
  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });
  socket.on("imgurl", (message)=>{
    broadcaster = socket.id;
    socket.broadcast.emit("showimage", message);
    
  })
});


server.listen(port, () => console.log(`Server is running on port ${port}`));
