const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    cpf: {
        type: BigInt,
        required:true
    },
    datanasc:{
        type: Date,
        required:true
    },
    logradouro:{
        type: String
    },
    cidade:{
        type: String
    },
    estado:{
        type: String
    },
    celular:{
        type: BigInt
    },
    email:{
        type:String
    }

});

module.exports = mongoose.model("Paciente", PacienteSchema);