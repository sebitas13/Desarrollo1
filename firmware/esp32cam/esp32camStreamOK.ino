
#include "Base64.h"
#include "WiFi.h"
#include "esp_camera.h"
#include "SocketIOclientMod.hpp"
#include <ArduinoJson.h>


/*Drive*/

#include <WiFiClientSecure.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"


// Pin definition for CAMERA_MODEL_AI_THINKER
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

#define USE_SERIAL Serial
#define LED_BUILTIN 4
#define SERVER "stellar-empty-boa.glitch.me"  // Server URL (without https://www)

/*Drive */
String myScript = "/macros/s/AKfycbzI6qCuzjD4ipP9KE8Lmeh7zym6J1i8STpbjAD05zDD2hafQDds6ghvF4vils1wv4OVlA/exec";    //Create your Google Apps Script and replace the "myScript" path.
String myLineNotifyToken = "myToken=**********";    //Line Notify Token. You can set the value of xxxxxxxxxx empty if you don't want to send picture to Linenotify.
String myFoldername = "&myFoldername=ESP32-CAM";
String myFilename = "&myFilename=ESP32-CAM.jpg";
String myImage = "&myFile=";




// Replace with your network credentials
const char* hostname = "ESP32CAM";
const char* ssid = "ARRIS 2.4GHZ";
const char* password = "47701709xyz";



SocketIOclientMod socketIO;
bool enviar_fotos = false;
bool monitoreo = false;
int pir = 13;  
int vpir = 0;

void messageHandler(uint8_t* payload) {
  StaticJsonDocument<64> doc;

  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    Serial.println(error.f_str());
    return;
  }

  String messageKey = doc[0];
  bool value = doc[1];

  if (messageKey == "buttonState") {  
    if(value){
      enviar_fotos = true;
      Serial.println("Activado stream");
    }else{
      enviar_fotos = false;
      Serial.println("Desactivado stream");
    }
    
    //digitalWrite(LED_BUILTIN, value);
  }

  if(messageKey == "buttonState2"){
    if(value){
      monitoreo = true;
      Serial.println("Activado monitero");
    }else{
      monitoreo = false;
      Serial.println("Desactivado monitero");
    }
  }
}


void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            USE_SERIAL.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

            // join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
            USE_SERIAL.printf("[IOc] get event: %s\n", payload);
            messageHandler(payload);
            break;
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}

void setupCamera()
{

    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d0 = Y2_GPIO_NUM;
    config.pin_d1 = Y3_GPIO_NUM;
    config.pin_d2 = Y4_GPIO_NUM;
    config.pin_d3 = Y5_GPIO_NUM;
    config.pin_d4 = Y6_GPIO_NUM;
    config.pin_d5 = Y7_GPIO_NUM;
    config.pin_d6 = Y8_GPIO_NUM;
    config.pin_d7 = Y9_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM;
    config.pin_href = HREF_GPIO_NUM;
    config.pin_sscb_sda = SIOD_GPIO_NUM;
    config.pin_sscb_scl = SIOC_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM;
    config.pin_reset = RESET_GPIO_NUM;
    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_JPEG;
    
    //Fluido mas color, pero tanta calidad de imagen(40)
    config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
    config.jpeg_quality = 40; //incrementar la calidad osea dismunir los numeros tambien genera desconnexion y conexion constante con el server
    config.fb_count = 1;

    //Fluido, buena calidad pero pequeño
    // config.frame_size = FRAMESIZE_QVGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
    // config.jpeg_quality = 8; //incrementar la calidad osea dismunir los numeros tambien genera desconnexion y conexion constante con el server
    // config.fb_count = 1;
  
    // Init Camera
    esp_err_t err = esp_camera_init(&config);
    if (err != ESP_OK) {
      Serial.printf("Camara fallo al iniciar, error 0x%x", err);
      delay(1000);
      ESP.restart();
    }else{
      Serial.println("Camara iniciada correctamente");
    }
  
}

void conexion_wifi(){
   // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectandose a WiFi..");
  }

  // Print ESP32 Local IP Address
  Serial.println("\nConectado : ");
  Serial.println(WiFi.localIP());
}

void conexion_servidor(bool e){
  // server address, port and URL
    e ? socketIO.beginSSL(SERVER, 443, "/socket.io/?EIO=4") : socketIO.begin("192.168.0.2",5000,"/socket.io/?EIO=4");
   // socketIO.begin("192.168.0.2",5000,"/socket.io/?EIO=4");
 // socketIO.beginSSL(SERVER, 443, "/socket.io/?EIO=4");
}

unsigned long messageTimestamp = 0;
void enviarfotos(){
    uint64_t now = millis();

    //No se recomienda tan rapido, socketIO puede ir desconentandose 
    if(now - messageTimestamp > 300) {
        messageTimestamp = now;
        camera_fb_t * fb = NULL;
        // Se toma fotos con la camara
        fb = esp_camera_fb_get();  
        if(!fb) {
          Serial.println("Camera capture failed");
          return;
        }        
        socketIO.sendBIN(fb->buf,fb->len);
        Serial.println("Image sent");
        esp_camera_fb_return(fb);  
      }
}

void setup(){
  Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN,HIGH);
  pinMode(pir,INPUT);
  //conectar wifi y inicar la camara
  conexion_wifi();
  setupCamera();
  // Conexion con el sevidor local o nube
  //  false local , true nube
  conexion_servidor(true);
  digitalWrite(LED_BUILTIN,LOW);
  // El manejador de eventos
  socketIO.onEvent(socketIOEvent);

}

unsigned long messageTimestamp2 = 0;
void monitorear(){
  uint64_t now = millis();
  if(now - messageTimestamp2 > 1000){
      messageTimestamp2 = now;
      vpir = digitalRead(pir);
      if(vpir==1){
        SendCapturedImage();
        Serial.println("Enviando foto");
      }
  }
 
}

void loop() {

    socketIO.loop();
    if(enviar_fotos){
      enviarfotos();
    }
    if(monitoreo){
      monitorear();
    }
   
}








String SendCapturedImage() {
  const char* myDomain = "script.google.com";
  String getAll="", getBody = "";
  
  camera_fb_t * fb = NULL;
  fb = esp_camera_fb_get();  
  if(!fb) {
    Serial.println("Camera capture failed");
    delay(1000);
    ESP.restart();
    return "Camera capture failed";
  }  
  
  Serial.println("Connect to " + String(myDomain));
  WiFiClientSecure client_tcp;
  client_tcp.setInsecure();   //run version 1.0.5 or above
  
  if (client_tcp.connect(myDomain, 443)) {
    Serial.println("Connection successful");
    
    char *input = (char *)fb->buf;
    char output[base64_enc_len(3)];
    String imageFile = "data:image/jpeg;base64,";
    for (int i=0;i<fb->len;i++) {
      base64_encode(output, (input++), 3);
      if (i%3==0) imageFile += urlencode(String(output));
    }
    String Data = myLineNotifyToken+myFoldername+myFilename+myImage;
    
    client_tcp.println("POST " + myScript + " HTTP/1.1");
    client_tcp.println("Host: " + String(myDomain));
    client_tcp.println("Content-Length: " + String(Data.length()+imageFile.length()));
    client_tcp.println("Content-Type: application/x-www-form-urlencoded");
    client_tcp.println("Connection: keep-alive");
    client_tcp.println();
    
    client_tcp.print(Data);
    int Index;
    for (Index = 0; Index < imageFile.length(); Index = Index+1000) {
      client_tcp.print(imageFile.substring(Index, Index+1000));
    }
    esp_camera_fb_return(fb);
    
    int waitTime = 10000;   // timeout 10 seconds
    long startTime = millis();
    boolean state = false;
    
    while ((startTime + waitTime) > millis())
    {
      Serial.print(".");
      delay(100);      
      while (client_tcp.available()) 
      {
          char c = client_tcp.read();
          if (state==true) getBody += String(c);        
          if (c == '\n') 
          {
            if (getAll.length()==0) state=true; 
            getAll = "";
          } 
          else if (c != '\r')
            getAll += String(c);
          startTime = millis();
       }
       if (getBody.length()>0) break;
    }
    client_tcp.stop();
    Serial.println(getBody);
  }
  else {
    getBody="Connected to " + String(myDomain) + " failed.";
    Serial.println("Connected to " + String(myDomain) + " failed.");
  }
  
  return getBody;
}


String urlencode(String str)
{
    String encodedString="";
    char c;
    char code0;
    char code1;
    char code2;
    for (int i =0; i < str.length(); i++){
      c=str.charAt(i);
      if (c == ' '){
        encodedString+= '+';
      } else if (isalnum(c)){
        encodedString+=c;
      } else{
        code1=(c & 0xf)+'0';
        if ((c & 0xf) >9){
            code1=(c & 0xf) - 10 + 'A';
        }
        c=(c>>4)&0xf;
        code0=c+'0';
        if (c > 9){
            code0=c - 10 + 'A';
        }
        code2='\0';
        encodedString+='%';
        encodedString+=code0;
        encodedString+=code1;
        //encodedString+=code2;
      }
      yield();
    }
    return encodedString;
}
