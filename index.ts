import express from "express";
import http from "http"
import { Server } from "socket.io";
import {writeFile} from "fs"
import path from 'path'
import cors from 'cors'
import {v4 as uuidv4} from 'uuid'

const app = express();
const port = process.env.PORT || 8080;


app.use(cors())

const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin: "*",
    methods: ["GET","POST"]
  }
})

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/chat/:room',(req,res)=>{
  res.render('room',{roomName: req.params.room})
})

app.set("view engine", "ejs");

app.get("/index", (req, res) => {
  res.render("index");
});

server.listen(port, () => {
  console.log(`private-chat listening at http://localhost:${port}`);
});



io.on('connection',(socket)=>{
  console.log('connected')

  socket.on('new_user', (data)=>{
    socket.broadcast.emit('new_user',data)
  })



  socket.on('new_message',(data)=>{
    console.log(data)
    let filename = uuidv4()
    if(data.file){
      writeFile(path.join(__dirname,`/public/tmp/${ filename }`) ,data.file,(err)=>{
        err ? console.log('error',err) : console.log('success')
      })
      let new_data = { ...data, filename }
    
    console.log("check filename",new_data)
    socket.broadcast.emit('new_message',new_data)
    }else{
    
    console.log("check filename",data)
    socket.broadcast.emit('new_message',data)
    }


    
  })
 
  socket.on("new_file",(data)=>{
    writeFile(path.join(__dirname,`/public/tmp/${data.filename}`) ,data.file,(err)=>{
      err ? console.log('error',err) : console.log('success')
    })
    socket.broadcast.emit('new_file',data)

  })
})

