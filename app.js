const express= require("express");
const app = express();
const path = require('path');

const mongoose= require("mongoose");
var Mensajes;
//conexion a la base de datos
mongoose.connect("mongodb://localhost/chat")
    .then(db=>{
        console.log("db is connected")

        //esto aquí por sincronía
        Mensajes=require("./models/Mensaje")
    })
    .catch(err=>{console.log(err)});



// config de server
app.set("port",process.env.PORT || 3000);

// arrancamos el servidor
const server = app.listen(app.get('port'),()=>{
    console.log("server on port ",app.get("port"));
})

// indicamos ruta de assets o contenido estático
app.use(express.static(path.join(__dirname,"public")));

// declaramos el socket
const SocketIO= require ("socket.io");
const IO = SocketIO(server);


// lógica web socket, para cada conexion se instancia el objeto socket
IO.on("connection",async (socket)=>{
    console.log("nueva conexion",socket.id);

    //en cada conexion recuperamos los mensajes existentes
    let mensajes = await Mensajes.find({}).limit(8).sort('-created_at');
    socket.emit("cargarMensajesExistentes",mensajes);

    // Evento de recibir un mensaje desde cliente
    socket.on("mensajito",async (data)=>{
        var newMsj= new Mensajes({
            autor:data.usuario,
            msg:data.msj
        })
        var guardado= await newMsj.save();
                
        //se emite este evento a TODAS LAS INSTANCIAS
        IO.sockets.emit("mensaje del servidor",guardado);
    });

    // Evento chat tipeando... en cliente
    socket.on("chat:typing",(data)=>{
        socket.broadcast.emit("tipeando",data);
    });

    // Evento input vacío en cliente
    socket.on("chat:msjvacio",(data)=>{
        socket.broadcast.emit("yaNoEscribe",data);
    });
});

