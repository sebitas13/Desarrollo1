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


