function Dados(id_paciente, bpm, oximetro, temperatura, data){
    this.id_paciente = id_paciente;
    this.bpm = bpm;
    this.oximetro = oximetro;
    this.temperatura = temperatura;
    this.data = data;
}

module.exports = Dados;