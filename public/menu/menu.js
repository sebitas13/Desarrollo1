const socket = io();
const temp = document.querySelector('#temperatura');
const hum = document.querySelector('#humedad');
const st = document.querySelector('#ST');
const ld = document.querySelector('#LDR');
//const p = document.querySelector('#PIR');
const f = document.querySelector('#FECHA');

const token = localStorage.getItem('token');

// if (!token) {
//     alert('Por favor inicie sesion')
//     window.location.href = '/index.html';
// }

socket.on('lecturas', (value)=> {
    console.log(value);

    const {
            temp_c,

            hume,
            s_ter,
            ldr,
            pir,
            Fecha_d} = JSON.parse(value);   //JSON.parse(value)
            var fecha = new Date(Fecha_d);
            var año = fecha.getFullYear();
            var mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que sumamos 1
            var día = fecha.getDate();
            var horas = fecha.getHours();
            var minutos = fecha.getMinutes();
            var segundos = fecha.getSeconds();
    temp.innerHTML= temp_c + ' °C';
    hum.innerHTML = hume +' %';
    st.innerHTML = s_ter +' °';
    ld.innerHTML = ldr +' LUX';
    f.innerHTML = día + '/' + mes + '/' + año +' '+ horas + ':' + minutos + ':' + segundos;
})







let id_usuario = document.querySelector('#usuario');
let lateral_abierto = false;
let usuario;
autorizar_menu();

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

async function autorizar_menu(){
    fetch('/api/usuarios/panel',{
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'authorization' : `${token}`
        },
    })
    .then(response => response.json())
    .then(respuesta=>{
        
        if(!respuesta.success){
            window.location.href = '../index.html';
        }else{
            usuario = respuesta.data.correo;
            id_usuario.textContent = `Usuario: ${usuario} `;
                toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": false,
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
            toastr["success"](`Bienvenido ${usuario}`, "Bienvienido");
        }

        
        
        
    }).catch(error=>{
        console.error(error);
    })
}

