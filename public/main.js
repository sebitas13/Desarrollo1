const socket = io();
const temp = document.querySelector('#temperatura');
const tempf = document.querySelector('#temperaturaF');
const hum = document.querySelector('#humedad');
const st = document.querySelector('#ST');
const ld = document.querySelector('#LDR');
//const p = document.querySelector('#PIR');
const f = document.querySelector('#FECHA');

const token = localStorage.getItem('token');

if (!token) {
    alert('Por favor inicie sesion')
    window.location.href = '/index.html';
}

socket.on('lecturas', (value)=> {
    console.log(value);

    const {
            temp_c,
            temp_f,
            hume,
            s_ter,
            ldr,
            pir,
            Fecha} = JSON.parse(value);   //JSON.parse(value)
    
    temp.innerHTML= temp_c + ' °C';
    tempf.innerHTML = temp_f +' °F';
    hum.innerHTML = hume +' %';
    st.innerHTML = s_ter +' °';
    ld.innerHTML = ldr +' LUX';
    p.innerHTML = pir;
    f.innerHTML = Fecha;
})




//Logica del boton encendido - apagado

const toggleBtn = document.getElementById('toggleBtn');
const toggleBtn2 = document.getElementById('toggleBtn2');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

let buttonState = false;
toggleBtn.addEventListener('click', () => {
    buttonState = !buttonState;
    updateUI();
    socket.emit('buttonState', buttonState);

    console.log('Dejando de transmitir video');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const updateUI = () => {
    buttonState
        ? toggleBtn.classList.add('on')
        : toggleBtn.classList.remove('on');
    toggleBtn.innerText = buttonState ? 'CLICK PARA APAGAR' : 'CLICK PARA ENCENDER';
};

socket.on('buttonState', state => {
    console.log('updated state', state);
    buttonState = state;
    updateUI();
});






//MONITEREO

let buttonState2 = false;
toggleBtn2.addEventListener('click', () => {
    buttonState2 = !buttonState2;
    updateUI2();
    socket.emit('buttonState2', buttonState2);
});

const updateUI2 = () => {
    buttonState2
        ? toggleBtn2.classList.add('on')
        : toggleBtn2.classList.remove('on');
    toggleBtn2.innerText = buttonState2 ? 'Click para desactivar' : 'Click para activar';
};

socket.on('buttonState2', state => {
    console.log('updated state', state);
    buttonState2 = state;
    updateUI2();
});



//STREAM

    
	
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


