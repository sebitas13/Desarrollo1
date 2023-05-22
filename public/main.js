const socket = io();
const temp = document.querySelector('#temperatura');
const tempf = document.querySelector('#temperaturaF');
const hum = document.querySelector('#humedad');
const st = document.querySelector('#ST');
const ld = document.querySelector('#LDR');
const p = document.querySelector('#PIR');
const f = document.querySelector('#FECHA');

socket.on('lecturas', (value)=> {

    console.log(value);

    const {
            temp_c,
            temp_f,
            hume,
            s_ter,
            ldr,
            pir,
            Fecha} = JSON.parse(value);
    
    temp.innerHTML= temp_c + ' °C';
    tempf.innerHTML = temp_f +' °F';
    hum.innerHTML = hume +' %';
    st.innerHTML = s_ter +' °';
    ld.innerHTML = ldr +' LUX';
    p.innerHTML = pir;
    f.innerHTML = Fecha;

    //socket.emit('enviame',"otra");
})

//ocket.emit('enviame',"otra");



//Logica del boton encendido - apagado

const toggleBtn = document.getElementById('toggleBtn');

let buttonState = false;

toggleBtn.addEventListener('click', () => {
    buttonState = !buttonState;
    updateUI();
    socket.emit('buttonState', buttonState);
});

const updateUI = () => {
    buttonState
        ? toggleBtn.classList.add('on')
        : toggleBtn.classList.remove('on');
    toggleBtn.innerText = buttonState ? 'Turn off' : 'Turn on';
};

socket.on('buttonState', state => {
    console.log('updated state', state);
    buttonState = state;
    updateUI();
});

