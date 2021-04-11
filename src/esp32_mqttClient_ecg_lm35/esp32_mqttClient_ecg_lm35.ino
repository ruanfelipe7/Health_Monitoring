#include <WiFi.h> 
#include <PubSubClient.h>

#define MAX_BUFFER 100

uint32_t prevData[MAX_BUFFER];
uint32_t sumData=0;
uint32_t maxData=0;
uint32_t avgData=0;
uint32_t roundrobin=0;
uint32_t countData=0;
uint32_t period=0;
uint32_t lastperiod=0;
uint32_t millistimer=millis();
double frequency;
double beatspermin=0;
uint32_t newData;

//WiFi
const char* SSID = "************";                 // SSID / nome da rede WiFi que deseja se conectar
const char* PASSWORD = "********";                 //Senha da rede WiFi que deseja se conectar
WiFiClient wifiClient;                        

const char* BROKER_MQTT = "********************"; // seu endereço IP  //  "broker.hivemq.com - funcionou"; // "broker.mqtt-dashboard.com - funcionou";  //"192.168.1.19"; "iot-eclipse.org"    //URL do broker MQTT que se deseja utilizar
int BROKER_PORT = 1883;                      // Porta do Broker MQTT


#define ID_MQTT  "Sensor ECG"            //Informe um ID unico e seu. Caso sejam usados IDs repetidos a ultima conexão irá sobrepor a anterior. 

//topicos 
#define TOPIC_PUBLISH_ECG "/4jggokgpepnvsb2uv4s40d59oc/ecg002/attrs"                  //Informe um Tópico único. Caso sejam usados tópicos em duplicidade, o último irá eliminar o anterior.
#define TOPIC_PUBLISH_ECG_BPM "/4jggokgpepnvsb2uv4s40d59oc/bpm002/attrs"
#define TOPIC_PUBLISH_TEMPERATURA "/4jggokgpepnvsb2uv4s40d59oc/temperatura002/attrs"
#define TOPIC_PUBLISH_OXIMETRO "/4jggokgpepnvsb2uv4s40d59oc/oximetro002/attrs"


PubSubClient MQTT(wifiClient);        // Instancia o Cliente MQTT passando o objeto espClient


/*
 * Don't take this for critical measurements !!! 
 * Do your own research on frequency detection for arbitrary waveforms.
 */
void freqDetec() {
  if (countData==MAX_BUFFER) {
   if (prevData[roundrobin] < avgData*1.5 && newData >= avgData*1.5){ // increasing and crossing last midpoint
    period = millis()-millistimer;//get period from current timer value
    millistimer = millis();//reset timer
    maxData = 0;
   }
  }
 roundrobin++;
 if (roundrobin >= MAX_BUFFER) {
    roundrobin=0;
 }
 if (countData<MAX_BUFFER) {
    countData++;
    sumData+=newData;
 } else {
    sumData+=newData-prevData[roundrobin];
 }
 avgData = sumData/countData;
 if (newData>maxData) {
  maxData = newData;
 }

 /* Ask your Ask your cardiologist
 * how to place the electrodes and read the data!
 */
//#ifdef PLOTT_DATA
// Serial.print(newData);
// Serial.print("\t");
// Serial.print(avgData);
// Serial.print("\t");
// Serial.print(avgData*1.5);
// Serial.print("\t");
// Serial.print(maxData);
// Serial.print("\t");
// Serial.println(beatspermin);
//#endif
 prevData[roundrobin] = newData;//store previous value
}
 

//Declaração das Funções
void mantemConexoes();  //Garante que as conexoes com WiFi e MQTT Broker se mantenham ativas
void conectaWiFi();     //Faz conexão com WiFi
void conectaMQTT();     //Faz conexão com Broker MQTT
void enviaPacote();     //

//---VARIÁVEIS DO ESTADO DE SAÚDE
const int ID_paciente =1;
float temperatura;
float ecg;
float bpm;
float oximetro;

int UpperThreshold = 518;
int LowerThreshold = 490;
int reading = 0;
float BPM = 0.0;
float BPM2 = 0.0;
bool IgnoreReading = false;
bool FirstPulseDetected = false;
unsigned long FirstPulseTime = 0;
unsigned long SecondPulseTime = 0;
unsigned long PulseInterval = 0;
//----------------------------------

char data[30];

//Sensor de Temperatura
const int analogPinTemp = A0;

//ECG
const int analogPinECG = 34;
 
int RawValue= 0;
double Voltage = 0;

void setup() {        

  Serial.begin(115200);

  conectaWiFi();
  MQTT.setServer(BROKER_MQTT, BROKER_PORT);  

//  MQTT.setCallback(recebePacote);  

  temperatura = 0;
  ecg         = 0;
  oximetro    = 0;
}

void loop() {
  mantemConexoes();
  sendEcg();
  sendBPM();
  sendTemperatura();
  sendOximetro();
  delay(100);
  MQTT.loop();
}

void mantemConexoes() {
    if (!MQTT.connected()) {
       conectaMQTT(); 
    }
    
    conectaWiFi(); //se não há conexão com o WiFI, a conexão é refeita
}

void conectaWiFi() {

  if (WiFi.status() == WL_CONNECTED) {
     return;
  }
        
  Serial.print("Conectando-se na rede: ");
  Serial.print(SSID);
  Serial.println("  Aguarde!");
  WiFi.begin(SSID, PASSWORD); // Conecta na rede WI-FI  
  while (WiFi.status() != WL_CONNECTED) {
      delay(100);
      Serial.print(".");
  }
  
  Serial.println();
  Serial.print("Conectado com sucesso, na rede: ");
  Serial.print(SSID);  
  Serial.print("  IP obtido: ");
  Serial.println(WiFi.localIP()); 
}

void conectaMQTT() { 
    while (!MQTT.connected()) {
        Serial.print("Conectando ao Broker MQTT: ");
        Serial.println(BROKER_MQTT);
        if (MQTT.connect(ID_MQTT)) {
            Serial.println("Conectado ao Broker com sucesso!");
        } 
        else {
            Serial.println("Nao foi possivel se conectar ao broker.");
            Serial.println("Nova tentativa de conexao em 10s");
            delay(10000);
        }
    }
}

//FUNÇÕES DE PUBLICAR NOS TOPICOS - ecg / temperatura / oximetro

void sendEcg() {
        ecg = getECG();
        snprintf(data, sizeof(data), "Ecg|%.2f", ecg);
        
        Serial.print("Tópico ECG : ");
        Serial.println(data);
        MQTT.publish(TOPIC_PUBLISH_ECG, data);        
}

void sendBPM() {
        bpm = getBPM();
        snprintf(data, sizeof(data), "BPM|%.2f", bpm);
        
        Serial.print("Tópico BPM : ");
        Serial.println(data);
        MQTT.publish(TOPIC_PUBLISH_ECG_BPM, data);        
}

void sendTemperatura() {
        temperatura = getTemperatura();
        
        //os dados são enviados da seguinte forma: "ID&&ECG"
        snprintf(data, sizeof(data), "Temperatura|%.2f", temperatura);
        
        Serial.print("Tópico temperatura : ");
        Serial.println(data);
        MQTT.publish(TOPIC_PUBLISH_TEMPERATURA, data);
}

void sendOximetro() {
        oximetro = getOximetro();
        
        //os dados são enviados da seguinte forma: "ID&&ECG"
        snprintf(data, sizeof(data), "Oximetro|%.2f", oximetro);
        
        Serial.print("Tópico oximetro : ");
        Serial.println(data);
        
        MQTT.publish(TOPIC_PUBLISH_OXIMETRO, data);        
}

//------------------------------------------------------------------------------

//FUNCOES QUE LÊ OS DADOS DOS SENSORES

float getECG(){
      newData = analogRead(analogPinECG);
      freqDetec();
      if (period!=lastperiod) {
         frequency = 1000/(double)period;//timer rate/period
         if (frequency*60 > 20 && frequency*60 < 200) { // supress unrealistic Data
            beatspermin=frequency*60;
            lastperiod=period;
         }
      }
      // Possíveis retornos: newData - avgData - avgData*1.5 - maxData - beatspermin - frequency
      return newData;
      //return random(59, 76);
}

float getBPM(){
    reading = analogRead(analogPinECG); 
    // Heart beat leading edge detected.
    if(reading > UpperThreshold && IgnoreReading == false){
      if(FirstPulseDetected == false){
        FirstPulseTime = millis();
        FirstPulseDetected = true;
      }
      else{
        SecondPulseTime = millis();
        PulseInterval = SecondPulseTime - FirstPulseTime;
        FirstPulseTime = SecondPulseTime;
      }
      IgnoreReading = true;
    }
    
    // Heart beat trailing edge detected.
    if(reading < LowerThreshold){
      IgnoreReading = false;
    }  
    
    BPM = (1.0/PulseInterval) * 60.0 * 1000;
    if (BPM >= 55&& BPM <=110 ) {
      BPM2 = BPM;
    }

    if (BPM<20){
      BPM = BPM+60;
    }else if (BPM<40 && BPM>20){
      BPM = BPM+40;
    }else if (BPM>40 && BPM<60){
      BPM = BPM+10;
    }else if (BPM>120) {
      BPM = 111;
    }else{
      BPM = BPM;
    }
    
    return BPM;
}


float getTemperatura() {
      const int analogIn = A0;
      float temperature = ((analogRead(analogIn)/2048.0)*3300)/10;
      return temperature;
}


float getOximetro() {

  return random(95, 100);
}
