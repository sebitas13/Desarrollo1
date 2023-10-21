const axios = require('axios');


const notificarIntruso = async () =>{
    

    try {
        const apiKey = process.env.PUSHBULLET_KEY;
    // const deviceIdentifier = 'IDENTIFICADOR_DEL_DISPOSITIVO';
        const fecha = new Date().toLocaleString();
        const message = `Fecha de la notificación: ${fecha}\nMensaje: Alerta de intruso`;

        const pushbulletEndpoint = 'https://api.pushbullet.com/v2/pushes';
        const data = {
            body: message+ '\n' + 'http://192.168.0.2:5000/',
            title: 'ALERTA DE INTRUSO',
            type: 'file',
            file_name : 'Intruso',
            file_type : 'image/jpeg',
            file_url : 'https://img.freepik.com/foto-gratis/delincuentes-negros-llevaban-hilo-cabeza-gris_1150-15139.jpg?w=996&t=st=1696915637~exp=1696916237~hmac=2a6bb2e757d0bbe0739376ef9baf8d174b8b24d4644d520526a5f143a514694c'
        }

        const headers = {
            'Access-Token': apiKey,
            'Content-Type': 'application/json',
        }

        let response = await axios.post(pushbulletEndpoint,data,{headers :headers} )
       
        console.log('Notificación enviada con éxito:', response.data);
        
    } catch (error) {
        console.error('Error al enviar la notificación:', error);
        
    }

}

module.exports = {
    notificarIntruso
}