#include <ESP8266WiFi.h>

#include <WiFiManager.h>
#include <strings_en.h>
#include <wm_consts_en.h>
#include <wm_strings_en.h>
#include <wm_strings_es.h>


#include <ArduinoJson.h>       // https://arduinojson.org/
#include <WebSocketsClient.h>  // download and install from https://github.com/Links2004/arduinoWebSockets
#include <SocketIOclient.h>

#define SSID "ARRIS 2.4GHZ"
#define PASSWORD "47701709xyz"
#define SERVER "stellar-empty-boa.glitch.me"  // Server URL (without https://www)

#include <DHT.h>
#include <DHT_U.h>
/********************************/
//int pir = 4;      //D2 -> 4
//int vpir = 0;

int ht = 5;
DHT dht(ht,DHT11);
float t,tf,h,st;

int ldr = A0;
int vldr = 0;
/********************************/
SocketIOclient socketIO;


// void messageHandler(uint8_t* payload) {
//   StaticJsonDocument<64> doc;

//   DeserializationError error = deserializeJson(doc, payload);

//   if (error) {
//     Serial.println(error.f_str());
//     return;
//   }

//   String messageKey = doc[0];
//   bool value = doc[1];

//   if (messageKey == "buttonState") {  
//     digitalWrite(LED_BUILTIN, value);
//   }
// }

void socketIOEvent(socketIOmessageType_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      Serial.println("Disconnected!");
      break;

    case sIOtype_CONNECT:
      Serial.printf("Connected to url: %s%s\n", SERVER, payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      break;

    case sIOtype_EVENT:
      //messageHandler(payload);
      break;
  }
}

void conexion_WIFI_Manager(){
  WiFiManager wifiManager; //Cremoas la instancia
  //wifiManager.resetSettings(); // Resetea la configuracion
  wifiManager.autoConnect("SebasESP8266","12345678");
  Serial.println("Ya estas conectado :)");
}

void conexion_WiFi() {
  Serial.println("\nConnecting...");

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected : ");
  Serial.println(WiFi.localIP());
}

void conexion_servidor(){
  // server address, port and URL
    //e ? socketIO.beginSSL(SERVER, 443, "/socket.io/?EIO=4") : socketIO.begin("192.168.0.2",5000,"/socket.io/?EIO=4");
   // socketIO.begin("192.168.0.2",5000,"/socket.io/?EIO=4");
  socketIO.beginSSL(SERVER, 443, "/socket.io/?EIO=4");
}


void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN,HIGH);
  dht.begin();
  //conexion_WiFi();
  conexion_WIFI_Manager();
  conexion_servidor();
  digitalWrite(LED_BUILTIN,LOW);
  //Controlador de eventos
  socketIO.onEvent(socketIOEvent);
}

void asignarValores(JsonObject weather){
          //vpir = digitalRead(pir);
          vldr = analogRead(ldr);
          h = dht.readHumidity();
          t = dht.readTemperature();
          tf = dht.readTemperature(true);
          st = dht.computeHeatIndex(t,h);
          
          weather["ldr"] = String(vldr);
          weather["temp_c"] = String(t);
          weather["temp_f"] = String(tf); 
          weather["hume"] = String(h);
          weather["s_ter"] = String(st);
          //weather["pir"] = vpir;
  }


unsigned long messageTimestamp = 0;
void loop() {
      socketIO.loop();

      uint64_t now = millis();

     if(now - messageTimestamp > 3000){
        messageTimestamp = now;
        //DynamicJsonDocument doc(1024): DynamicJsonDocument permite almacenar documentos mucho más grandes en the heap,no está limitado por el tamaño de la pila
        //StaticJsonDocument<200> : Utiliza una asignación de memoria fija, lo que le permite funcionar en dispositivos con muy poca RAM.

        //Se le asigna memoria para el documento
        //ArduinoJson utiliza una asignación de memoria fija, lo que le permite funcionar en dispositivos con muy poca RAM. almacena datos en la pila:
        
        StaticJsonDocument<200> doc; //O en el monton -> DynamicJsonDocument doc(2048);
        
        //Se crea una matriz vacia en el doc
        JsonArray array = doc.to<JsonArray>();

        // Se agrega el nombre del evento
        // Sugerencia: socket.on('nombre_evento', ....)
        //Se le agrega un valor a la matriz
        array.add("message");

        // agregar payload (parámetros) para el evento, 
        // Se crea el  objeto weather y se agrega a la matriz array
        JsonObject weather = array.createNestedObject();
 
        //Asigna propiedades y valor al objeto weather

        asignarValores(weather);
        
        //JSON a String - serializacion
        String json;
        serializeJson(doc,json);
        
       //Enviar evento
        socketIO.sendEVENT(json); 

        //Se genera el JSON embellecido, se envia al puerto serie.
        //Serial.println(json);
        serializeJsonPretty(doc, Serial);
        
     }

    
    
}






    /* weather["ldr"] = String(analogRead(ldr));
        weather["temp_c"] = String(dht.readTemperature());
        weather["temp_f"] = String(dht.readTemperature(true)); 
        weather["hume"] = String(dht.readHumidity());
        weather["s_ter"] = String(dht.computeHeatIndex(t,h));
        weather["pir"] = digitalRead(pir);*/