const socket = io(); //solo funciona si es el misno dominio

//Elementos DOM
let message = document.getElementById("message");
let username = document.getElementById("username");
let boton = document.getElementById("send");
let output = document.getElementById("output");
let actions = document.getElementById("actions");


/*
    EVENTOS DE CLIENTE
*/

// enviar mensaje
boton.addEventListener('click',()=>{
    if(message.value.trim()!="" && username.value.trim()!=""){
        socket.emit('mensajito',{
            usuario: username.value,
            msj: message.value
        });
        message.value="";
        socket.emit("chat:msjvacio",username.value);
    }
});
// Evento escribiendo
message.addEventListener("keypress",()=>{    
        socket.emit("chat:typing",username.value);    
});
// Eventos mensaje vacío
message.addEventListener("change",()=>{
    if(message.value.trim()=="")
    socket.emit("chat:msjvacio",username.value)
});
message.addEventListener("keyup",()=>{
    if(message.value.trim()=="")
    socket.emit("chat:msjvacio",username.value)
});

/*
    EVENTOS QUE ESCUCHAN AL SERVIDOR 
*/

// mensajes nuevos
socket.on("mensaje del servidor",(data)=>{
    output.innerHTML+=pintarMensjaeUnico(data);
});

// Mensajes Existentes (la primera vez que se conecta alguien)
socket.on("cargarMensajesExistentes",(data)=>{
    data.sort((a,b)=>a["created_at"]>b["created_at"])
    data.forEach(msj => {
        output.innerHTML+=pintarMensjaeUnico(msj);
    });
});
// Otra persona escribe
socket.on("tipeando",(data)=>{
    console.log(data);
    actions.innerHTML = `<p><em>${data} está escribiendo</em></p>`
});
// lo contrario a lo anterior
socket.on("yaNoEscribe",(data)=>{
    console.log("ya no escribe "+data);
    borraPdeActions(data);
})


// UTILS
function borraPdeActions(usuario){
    var ps = actions.getElementsByTagName("p");
    for (let i = 0; i < ps.length; i++) {
        if(ps[i].innerHTML.includes(usuario.toString())){
            console.log("vamos a borrar "+ps[i]);
            ps[i].remove();

        }
    }
}

function pintarMensjaeUnico(data){
    return `<p>
    <strong>${data.autor}:</strong> ${data.msg} <small>${data.created_at.substring(11,19)}<small>
    </p>`;
}