import express, { NextFunction } from 'express';
import { Socket } from 'socket.io';
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const session = require('express-session')({
	secret: 'St5Q3wPtv4TJ',
	resave: false,
	saveUninitialized: true
});
const chatListener = require('./Listener/chatListener');
const userListener = require('./Listener/userListener');
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
app.use(session);
io.use((socket: Socket,next: NextFunction)=>{
  session(socket.request,{},next);
});
//app.use(express.static(path.join(__dirname, '../../dist')));
chatListener(io);
userListener(io);
const launch =(port:number) => {
    server.listen(port, () => {
        console.log('Server listening at port %d', port);
    });
}

export default launch;