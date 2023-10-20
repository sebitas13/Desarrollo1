
            const socket = io();
            const toggleBtn1 = document.getElementById('toggleBtn1');
            
            let lateral = document.querySelector('.menu-lateral');
            let lateral_abierto = false;

            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');

            // ENCENDER APAGAR CAMARA
            let camaraState = false;
            toggleBtn1.addEventListener('click', () => {
                camaraState = !camaraState;
                updateUI();
                console.log('Estado actualizado', camaraState);
                socket.emit('camaraState', camaraState);

                ctx.clearRect(0, 0, canvas.width, canvas.height);    
               
            });

            const updateUI = () => {
                if(camaraState){
                    toggleBtn1.classList.add('on');
                    canvas.setAttribute('style','display:flex');
                    
                }else{
                    toggleBtn1.classList.remove('on'); 
                    
                    canvas.setAttribute('style','display:none');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
               
                toggleBtn1.innerText = camaraState ? 'ON' : 'OFF';
            };

            //Es necesario para que se actualice el boton en los otros usuarios
            socket.on('camaraState', state => {
              
                camaraState = state;
                updateUI();
                console.log('Estado actualizado por otro usuario', state);
            });


            // ENCENDER APAGAR ILUMINACION MANUALMENTE
            const toggleBtn3 = document.getElementById('toggleBtn3');
            let iluminarState = false;
            toggleBtn3.addEventListener('click', () => {
                iluminarState = !iluminarState;
                updateUI3();
                console.log('Estado iluminar: ', iluminarState);
                socket.emit('iluminarState', iluminarState);
               
            });

            const updateUI3 = () => {
                if(iluminarState){
                    toggleBtn3.classList.add('on');
                    
                }else{
                    toggleBtn3.classList.remove('on'); 
                }
               
                toggleBtn3.innerText = iluminarState ? 'ON' : 'OFF';
            };

            //Es necesario para que se actualice el boton en los otros usuarios
            socket.on('iluminarState', state => {
              
                iluminarState = state;
                updateUI3();
                console.log('Estado luz actualizado por otro usuario', state);
            });

            //ENCENDER LA LUZ EN LA OSCURIDAD
            
            // socket.on('lecturas', (value)=> {

            //     console.log(value);

            //     const {
            //             temp_c,
            //             temp_f,
            //             hume,
            //             s_ter,
            //             ldr,
            //             pir,
            //             Fecha} = JSON.parse(value);   //JSON.parse(value)
                 
            //             if(parseFloat(ldr)<100){
            //                 buttonState3 = true;
            //                 updateUI3();
            //                 socket.emit('iluminar', buttonState3);
            //             }else{
            //                 buttonState3 = false;
            //                 updateUI3();
            //                 socket.emit('iluminar', buttonState3);
            //             }
                

            //     });
            // ---------------------
           
            var img = new Image();  
            img.onload = function() { //funcion  se ejecuta cuando la imagen se carga correctamente.

                    //Se define el ancho y alto del elemento de lienzo (canvas) en base a las dimensiones de la imagen cargada(img)
                    canvas.style.width=this.width+'px'; 
                    canvas.style.height=this.height+'px'; 

                    //Para dibujar la imagen cargada (img) en el lienzo. Los parámetros especifican la imagen de origen (coordenadas x e y, ancho y alto),
                    // así como la ubicación y el tamaño en el lienzo donde se dibujará la imagen.
                    ctx.drawImage(this, 0, 0, this.width,this.height, 0, 0, canvas.width, canvas.height); 

               
            }
            

            socket.on('stream_to_client', function(message) {
                
                // Se crea un objeto Blob a partir del contenido del mensaje. 
                //El mensaje debe contener los datos binarios de la imagen en formato JPEG. 
                //La opción type se establece en "image/jpeg" para indicar que el Blob contiene una imagen JPEG.

                var blob = new Blob([message], {type: "image/jpeg"}); 

                //Se crea una referencia al objeto URL, que es una interfaz proporcionada
                // por los navegadores para crear y gestionar URL de objetos.
                var domURL = self.URL || self.webkitURL || self;
                //Se utiliza el objeto URL para crear una URL de objeto a partir del Blob creado anteriormente
                url = domURL.createObjectURL(blob);

                //Se establece la propiedad src de un elemento de imagen (img) con la URL generada. 
                ///Esto carga la imagen en el elemento de imagen y la muestra en el navegador.
                img.src = url;	
            });

            //Cada dos minutos se desactiva la camara por seguridad
            
            function apagarCamaraAutomaticamente() {
                camaraState = false;
                updateUI();
                console.log('Se termino el tiempo', camaraState);
                socket.emit('camaraState', camaraState);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            const intervalo = setInterval(apagarCamaraAutomaticamente, 120000);


            //CAPTURAR IMAGENES EN EL CLIENTE - NAVEGADOR

            const capturarBtn = document.getElementById('capturarBtn');
            const imgCapturada = document.querySelector('#imgCapturada');
            capturarBtn.addEventListener('click', () => {
                const lienzo = document.getElementById('canvas'); 
                const imagenCapturada = lienzo.toDataURL('image/jpeg');
                console.log(imagenCapturada); 
                imgCapturada.src = imagenCapturada
            });


           

            function mostrarLateral(){
                  if(!lateral_abierto){
                      lateral.setAttribute('style','left:0px')
                  }else{
                      lateral.setAttribute('style','left:-240px')
                  }
                  lateral_abierto = !lateral_abierto;
            }

            function logout(){
                  localStorage.removeItem('token');
                  toastr.options = {
                      "closeButton": false,
                      "debug": false,
                      "newestOnTop": true,
                      "progressBar": true,
                      "positionClass": "toast-bottom-full-width",
                      "preventDuplicates": true,
                      "onclick": null,
                      "showDuration": "300",
                      "hideDuration": "1000",
                      "timeOut": "2000",
                      "extendedTimeOut": "1000",
                      "showEasing": "swing",
                      "hideEasing": "linear",
                      "showMethod": "fadeIn",
                      "hideMethod": "fadeOut"
                  }
                  toastr["info"]("Cerrando sesión", "Logout")
                  setTimeout(()=>{
                      window.location.href = '../index.html';
                  },2000)     
                  
              }
      

            
 