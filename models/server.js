
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
var cron = require('node-cron');

const {Database} = require('../database/config');


class Servidor {


    constructor(){
        //Creamos una función de controlador de solicitudes
        //Diseñada específicamente para ser un oyente de solicitud http 
        //al que se le pasan los argumentos (req, res)de una solicitud http entrante
        this.app = express();
        //Esteblecemos el puerto a partir de las variables de entorno
        this.port = process.env.PORT;
        //CreateServer recibe la funcion requestlistener el cual se va llamar cada vez que el servidor reciba una solicitud
        //En este caso le enviamos nuestro app de express
        this.server = createServer(this.app); //retorna una instancia de http server

        this.io = new Server(this.server,{cors : {origin : '*'}});

      

        
        
        this._usuariosPath = '/api/usuarios'
        
        //this.conexionDB();
        this.middlewares();
        this.routes();

        this.sockets();
        
    }

    conexionDB(){
        new Database();
    }

    middlewares(){

        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.static('public'));

    }

    routes(){

    }

    sockets(){
        let buttonState = false;
        this.io.on('connection',(socket)=>{
            console.log('Cliente conectado');
                
            socket.on('disconnect',()=>{
                console.log('Cliente desconectado');
            })

            socket.on('message',(message)=>{
                //message['Fecha'] = (new Date().toLocaleString("es-MX", {timeZone: "America/Lima"})); //para el deploy
                message['Fecha'] = (new Date().toLocaleString());
               socket.broadcast.emit('lecturas', JSON.stringify(message));
                //socket.broadcast.emit('lecturas', message);
                console.log('Desde esp8266: '+JSON.stringify(message));
            })

            socket.on('message2',(message)=>{
                
                //message['Fecha'] = (new Date().toLocaleString());
                socket.broadcast.emit('lecturas2', JSON.stringify(message));
                //socket.broadcast.emit('lecturas', message);
                console.log('Desde esp32cam:' +JSON.stringify(message));
            })


            //Logica del boton

            socket.on('buttonState', value => {
                console.log('buttonState:', value);
                buttonState = value;
                socket.broadcast.emit('buttonState', value);
            });
            
            
            //Simulacion de envio de entrada de sensores
            // cron.schedule("*/5 * * * * *", ()=>{
            //     console.log('Enviando tarea programada');
            //     socket.emit('lecturas',{
            //         temperatura : Math.floor(Math.random() * (100 - 10) + 10),
            //         temperaturaF: Math.floor(Math.random() * (100 - 10) + 10),
            //         humedad :  Math.floor(Math.random() * (100 - 10) + 10),
            //         SensacionTermica :  Math.floor(Math.random() * (100 - 10) + 10),
            //         LDR :  Math.floor(Math.random() * (100 - 10) + 10),
            //         PIR :  Math.floor(Math.random() * (100 - 10) + 10),
            //         Fecha :  (new Date().toLocaleString())
            //     });
            // });
                
        })
        
    }

    listen(){
        this.server.listen(this.port,()=>{
            console.log(`${(new Date())} escuchando en el puerto ${this.port}`);
        })
    }

}


module.exports = {
    Servidor
}


