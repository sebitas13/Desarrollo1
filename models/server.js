
const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const {saveSensores,simularDatos} = require('../helpers/saveSensores');
const {saveImagenes} = require('../helpers/saveImagenes');
const Imagen = require('./imagen');
var cron = require('node-cron');
const {Database} = require('../database/config');




let array_sensores = [];
let array_imagenes = [];
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
        
        this.conexionDB();
        this.middlewares();
        this.routes();

        this.sockets();
        
    }

    conexionDB(){
        new Database();
    }

    middlewares(){

        //this.app.use(bodyParser.urlencoded({ extended: false })) //ya no es neceario el body-parser
        this.app.use(express.urlencoded({ extended: true })); //Middleware para analizar datos de formularios codificados
        this.app.use(express.json()); //para analizar el cuerpo de las solicitudes entrantes en formato JSON
        this.app.use(cors());
        this.app.use(express.static('public'));

    }

    routes(){
        this.app.use(this._usuariosPath,require('../routes/sensor.router'));
        this.app.use(this._usuariosPath,require('../routes/image.router'));
        this.app.use(this._usuariosPath,require('../routes/usuario.router'));
    }

    sockets(){
        let estadoBoton = false;
        let estadoMonitoreo = false;
        let estadoIluminar = false;
        this.io.on('connection',(socket)=>{
            console.log(`Conectado con el cliente ${socket.id}`)
            socket.emit('buttonState', estadoBoton);  //Si se conecta un nuevo usuario, recibe el valor del boton ya actualizado      
            socket.emit('buttonState2', estadoMonitoreo);
            socket.emit('iluminar', estadoIluminar);
            
            
            socket.on('disconnect',()=>{

                estadoBoton = false;
              //  estadoMonitoreo = false;
                socket.broadcast.emit('buttonState', estadoBoton);
              //  socket.broadcast.emit('buttonState2', estadoMonitoreo);
                console.log('Cliente desconectado');
            })

            socket.on('message',(message)=>{
                //message['Fecha'] = (new Date().toLocaleString("es-MX", {timeZone: "America/Lima"})); //para el deploy

                let date = new Date();
                //message['Fecha'] = (new Date().toLocaleString());
                message['Fecha'] = date.getTime();
                message['Fecha_d'] = date;
                array_sensores.push(message)    ;                                   //Activar cuando se desea guardar en la BD
                socket.broadcast.emit('lecturas', JSON.stringify(message));
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
                estadoBoton = value;
                socket.broadcast.emit('buttonState', value); //revisar esto, para que al cambiar
                                                //El estado del boton, lo haga para todos los usuarios
            });


            socket.on('buttonState2', value => {
                console.log('buttonState2:', value);
                estadoMonitoreo = value;
                socket.broadcast.emit('buttonState2', value);
            });

            //Lectura de boton eliminar

            socket.on('iluminar', value => {
                
                // estadoBoton = value;
                estadoIluminar = value;
                socket.broadcast.emit('iluminar', value);
            });


            //Monitoreo

            socket.on('monitoreo_event',function(msg){
                console.log('imagenes del monitoreo');
                console.log(msg.pic);
                array_imagenes.push(msg.pic);

                if(array_imagenes.length > 4){
                    saveImagenes(array_imagenes);
                    array_imagenes = []
                    console.log('save images in mongodb');
                } 
            });

            //Stream
            
            socket.on('stream_event', function(msg){
                //console.log("imagen recibida del esp32cam")
                socket.broadcast.emit('stream_to_client',msg.pic)
            });
            
            
            
          
            // Simulacion de envio de entrada de sensores
            
            // cron.schedule("*/5 * * * * *", ()=>{
            //     console.log('Enviando tarea programada');
            //     const obj = simularDatos();
            //     array_sensores.push(obj);
            //     socket.emit('lecturas',JSON.stringify(obj));
            // });
           
            
                
        })

        //Guardar la info de los sensores en la BD cada 15 minutos

        cron.schedule("*/15 * * * *",()=>{
            saveSensores(array_sensores);
            
            console.log('save in mongodb');
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


