
const express = require('express');
const {createServer} = require('http'); //función proporcionada por Node.js para crear un servidor HTTP.
const {Server} = require('socket.io'); 
const cors = require('cors');
const {simularDatos,saveSensores} = require('../helpers/saveSensores');
const {saveImagesMongo} = require('../helpers/saveImagenes');
var cron = require('node-cron');
const {Database} = require('../database/config');



let array_sensores = [];
let array_imagenes = [];
class Servidor {

    constructor(){

        //app instancia del Servidor HTTP de Express
        this.app = express(); 
        //Esteblecemos el puerto a partir de las variables de entorno
        this.port = process.env.PORT; 
        //Se crea un servidor HTTP utilizando createServer, usando el servidor Express como manejador de solicitudes
        //Para tener un mayor control sobre el servidor de express.
        this.server = createServer(this.app); 
        //El servidor WebSocket utiliza el mismo this.server como servidor HTTP
        //Ambos (Express.js y socket.io) comparten el mismo servidor HTTP.
        //Se configura el cors para permitir solicitudes desde cualquier origen (*).
        this.io = new Server(this.server,{cors : {origin : '*'}}); 

        //Un solo servidor HTTP maneja tanto las solicitudes HTTP para la apliacion Express.js 
        //como las conexiones WebSocket para la aplicación de tiempo real mediante socket.io

        this._usuariosPath = '/api/usuarios'
        
        this.conexionDB();
        this.middlewares();
        this.routes();
        this.sockets();
        
    }

    conexionDB(){
        new Database();
    }

    middlewares(){

        //Analiza el cuerpo de las solicitudes entrantes de formularios codificados y los convierte en objetos JS
        //extended: true, si se espera recibir datos de formularios complejos con objetos anidados o arreglos
        this.app.use(express.urlencoded({ extended: true }));
        //Analiza el cuerpo de las solicitudes entrantes en formato JSON desde el cliente y los convierte en objetos JS
        this.app.use(express.json());
        //Habilita el intercambio de recursos entre diferentes dominios (CORS). 
        this.app.use(cors());
        //Sirve archivos estáticos (HTML,CSS,JS) desde el directorio 'public'. Cuando una solicitud al llega servidor para un archivo estático
        this.app.use(express.static('public'));
        
    }

    routes(){
        this.app.use(this._usuariosPath,require('../routes/sensor.router'));
        this.app.use(this._usuariosPath,require('../routes/image.router'));
        this.app.use(this._usuariosPath,require('../routes/usuario.router'));
    }

    sockets(){
        let estadoCamara = false;
        let estadoMonitoreo = false;
        let estadoIluminar = false;
        let estadoNotifiacion = false;
        this.io.on('connection',(socket)=>{

            console.log(`Conectado con el cliente ${socket.id}`)
            //Al conectarse un usuario, reciben el estado actual de los botones
            socket.emit('camaraState', estadoCamara); 
            socket.emit('monitoreoState', estadoMonitoreo);
            socket.emit('iluminarState', estadoIluminar);
            
            
            socket.on('disconnect',()=>{

                estadoCamara = false;
                socket.broadcast.emit('camaraState', estadoCamara);
              //  estadoMonitoreo = false; No es conveniente desactivarlo si esta monitoreando
              //  socket.broadcast.emit('monitoreoState', estadoMonitoreo);
                console.log('Cliente desconectado');
            })

            socket.on('message',(message)=>{
                //message['Fecha'] = (new Date().toLocaleString("es-MX", {timeZone: "America/Lima"})); //para el deploy

                let date = new Date();
                //message['Fecha'] = (new Date().toLocaleString());
                message['Fecha'] = date.getTime();
                message['Fecha_d'] = date;
                /*********************SAVE SENSORS LECTURES**********************************************/
                //array_sensores.push(message) ; //Activar cuando se desea guardar en la BD
                socket.broadcast.emit('lecturas', JSON.stringify(message));
                console.log('Desde esp8266: '+JSON.stringify(message));
            })

          

            /****************** LECTURA  ******************/

            socket.on('camaraState', value => {
                console.log('camaraState:', value);
                estadoCamara = value;
                socket.broadcast.emit('camaraState', value); //revisar esto, para que al cambiar
                                //El estado del boton, lo haga para todos los usuarios
            });

            socket.on('monitoreoState', value => {
                console.log('monitoreoState:', value);
                estadoMonitoreo = value;
                socket.broadcast.emit('monitoreoState', value);
            });

            socket.on('iluminarState', value => {
                estadoIluminar = value;
                socket.broadcast.emit('iluminarState', value);
            });

            socket.on('notificacionState', value => {
                estadoNotifiacion = value;
                socket.broadcast.emit('notificacionState', value);
                console.log('Estado notificacion',estadoNotifiacion);
            });


            //EVENTO DEL MONITOREO

            socket.on('monitoreo_event',function(msg){
                console.log('imagenes del monitoreo');
                console.log(msg.pic);

                /*********************SAVE IMAGENES******************************/
                const imagen = {
                    pic: msg.pic,
                    tiempo: new Date()
                };
                array_imagenes.push(imagen);
                saveImagesMongo(array_imagenes,estadoNotifiacion);

               
            });

            //EVENTO DEL STREAM
            
            socket.on('stream_event', function(msg){
                //console.log("imagen recibida del esp32cam")
                socket.broadcast.emit('stream_to_client',msg.pic)
            });
            
          
            
        })

        //sendSensorSimulated();

        //Guardar la info de los sensores en la BD cada 15 minutos
        /*********************SAVE SENSOR IN MONGO******************************/
        
        // cron.schedule("*/15 * * * *",()=>{
        //     saveSensores(array_sensores);
            
        //     console.log('save in mongodb');
        // })
        
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