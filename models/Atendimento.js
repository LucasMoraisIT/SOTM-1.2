const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const AtendimentoSchema = new Schema({
    titulo:{
        type: String,
        required: true
    },
    turno: {
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    paciente:{
        type: Schema.Types.ObjectId,
        ref:"Paciente",
    },
    data:{
        type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model("Atendimento", AtendimentoSchema);