import ExceptionHandler from "./Domain/Exception/ExceptionHandler";

const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const chatListener = require('./Listener/chatListener');
const userListener = require('./Listener/userListener');
const port = process.env.PORT || 3000;
const io = require('socket.io')(server,{
  cors:{
    origin: ['http://localhost:8080','http://localhost:8081','http://localhost:8082'],
    methods: ['GET','POST'],
    credentials: true
  }
});
app.use(cors({
  origin: ['http://localhost:8080','http://localhost:8081','http://localhost:8082'],
  credentials: true
}));
app.use(express.json());
//app.use(express.static(path.join(__dirname, '../../dist')));
chatListener(io);
userListener(io);
app.use(ExceptionHandler.handle);

const launch =(port:number) => {
    server.listen(port, () => {
        console.log('Server listening at port %d', port);
    });
}

export default launch;