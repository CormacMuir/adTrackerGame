const io = require("socket.io-client").connect("http://localhost:3000");
io.on("seq-num", (msg) => alert(msg));