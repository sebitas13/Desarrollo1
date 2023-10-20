

            const socket = io();
            const toggleBtn1 = document.getElementById('toggleBtn1');
            
            let lateral = document.querySelector('.menu-lateral');
            let lateral_abierto = false;

            // ENCENDER APAGAR MONITOREO
            let monitoreoState = false;
            toggleBtn1.addEventListener('click', () => {
                monitoreoState = !monitoreoState;
                updateUI();
                console.log('Estado actualizado', monitoreoState);
                socket.emit('monitoreoState', monitoreoState);

                // ctx.clearRect(0, 0, canvas.width, canvas.height);    
               
            });

            const updateUI = () => {
                if(monitoreoState){
                    toggleBtn1.classList.add('on');
                    // canvas.setAttribute('style','display:flex');
                    
                }else{
                    toggleBtn1.classList.remove('on'); 
                    
                }
               
                toggleBtn1.innerText = monitoreoState ? 'ON' : 'OFF';
            };

            //Es necesario para que se actualice el boton en los otros usuarios
            socket.on('monitoreoState', state => {
              
                monitoreoState = state;
                updateUI();
                console.log('Estado actualizado por otro usuario', state);
            });



            //Cada minuto se desactiva la camara por seguridad
            
            function apagarMonitoreoAutomaticamente() {
                console.log("Esta función se ejecuta cada minuto.");
                monitoreoState = false;
                updateUI();
                 console.log('Se termino el tiempo', monitoreoState);
                //alert('Camara apagada por seguridad');
                socket.emit('monitoreoState', monitoreoState);

                // ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            setInterval(apagarMonitoreoAutomaticamente, 1200000);


            const eliminarBtn = document.getElementById('eliminarBtn');
            eliminarBtn.addEventListener('click', async () => {
                const confirmacion = confirm("¿Estas seguro?");
                if(confirmacion){
                    await eliminarImagenes();
                    window.location.reload();
                }
                            
            });

            const actualizarBtn = document.getElementById('actualizarBtn');
            actualizarBtn.addEventListener('click',  () => {
                window.location.reload();
                            
            });



        let fechaIntruso;
        let numeroDocumentos=0;
        async function getDataImagenes(page) {
                try {

                const response  = await fetch(`/api/usuarios/lectura-imagenes?page=${page}`,{ method : 'GET' });
                    
                const {success,message,data,numDoc} = await response.json();
                let imagenes = data[0];
                numeroDocumentos = numDoc;
                if(!success){
                     throw new Error('Error: '+message)
                    
                }
                    if(imagenes){
                        
                        
                        fechaIntruso = imagenes.fecha;
                        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
                        document.querySelector('#intruso').textContent = new Date(fechaIntruso).toLocaleDateString(undefined,opciones);
                        return imagenes.lecturas;
                    }  

                } catch (error) {
                    console.error(error)
                    
                } 
            }

            async function eliminarImagenes() {
                try {

                const response  = await fetch('/api/usuarios/eliminar-imagenes',{ method : 'DELETE' });

                const {success,message,data} = await response.json();
                if(!success){
                    throw new Error('Error: '+message)
                }
                return message;

                } catch (error) {
                    console.error(error)
                    throw error;
                } 
            }

          

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
            

            let currentPage = 1; 
            let arreglo_imagenes = [];
            async function displayGalleryPage(pageNumber) {
    try {
        // Obtiene todos los documentos
        const arreglo_imagenes = await getDataImagenes(pageNumber);

        // Limpia el contenedor de la galería
        galleryContainer.innerHTML = '';

        // Agrega las imágenes al contenedor de la galería
        if(arreglo_imagenes){
            arreglo_imagenes.forEach((imageData, index) => {
            const imageUrl = `data:image/jpeg;base64,${imageData.pic}`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `Imagen ${index + 1}`; // Números de imagen comenzando desde 1
            imgElement.classList.add('gallery-item'); 
            
            // Se establece un tamaño máximo para las imágenes
            imgElement.style.maxWidth = '200px';
            imgElement.style.maxHeight = '150px';

            // Se crea un elemento para mostrar el tiempo
            const timestampElement = document.createElement('span');
            timestampElement.textContent = `Tiempo: ${new Date(imageData.tiempo).toLocaleString()}`;
            timestampElement.classList.add('timestamp'); // Puedes agregar estilos CSS según sea necesario

            // Se crea un contenedor para la imagen y su marca de tiempo
            const container = document.createElement('div');
            container.classList.add('image-container');
            container.appendChild(imgElement);
            container.appendChild(timestampElement);

            galleryContainer.appendChild(container);
        });

        }
        currentPage = pageNumber;

        updatePagination(numeroDocumentos)
    } catch (error) {
        console.error('Error al mostrar los documentos:', error);
    }
}


function updatePagination(totalPages) {
    pagination.innerHTML = ''; // Limpiar paginación
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.textContent = i;
        pageLink.classList.add('page-number');
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', () => {
            displayGalleryPage(i);
        });
        pagination.appendChild(pageLink);
    }
}


galleryContainer.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('gallery-item')) {
        const imageUrl = target.src;
        
        // Crear un elemento de la imagen ampliada
        const zoomedImage = document.createElement('div');
        zoomedImage.classList.add('img-zoomed');
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        zoomedImage.appendChild(imgElement);

        // Agregar el elemento de imagen ampliada al cuerpo del documento
        document.body.appendChild(zoomedImage);

        // Para salir del modo de zoom 
        zoomedImage.addEventListener('click', function() {
            zoomedImage.remove(); // Elimina la imagen ampliada del DOM
        });
    }
});


        // Mostrar la primera página al cargar la página
        displayGalleryPage(1);

        setInterval(function() {
            displayGalleryPage(currentPage);
            console.log("actualizando images");
        }, 5000); 
            
 