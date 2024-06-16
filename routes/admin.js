// Chamadas
const express = require("express");
const router = express.Router();
const Paciente = require("../models/Paciente");
const Atendimento = require("../models/Atendimento");
const {eAdmin} = require("../helpers/eAdmin")
router.get("/",eAdmin, (req, res) => {
    res.render("admin/index");
});
// Pacientes -----------------------------------------------------------------------//
    router.get('/pacientes', eAdmin,(req, res) => {
        Paciente.find()
            .then((pacientes) => {
                res.render("admin/pacientes", {
                    pacientes: pacientes
                });
            })
            .catch((err) => {
                console.error("Erro ao listar pacientes:", err);
                req.flash("error_msg", "Houve um erro ao listar os pacientes");
                res.redirect("/admin");
            });
    });

    router.get("/pacientes/add", eAdmin,(req, res) => {
        res.render("admin/addpacientes");
    });

    router.post("/pacientes/novo",eAdmin, (req, res) => {
        const novoPaciente = new Paciente({
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            datanasc: req.body.datanasc,
            logradouro: req.body.logradouro,
            cidade: req.body.cidade,
            estado: req.body.estado
        });
        novoPaciente.save()
            .then(() => {
                req.flash("success_msg", "Paciente resgistrado com sucesso");
                res.redirect("/admin/pacientes");
            })
            .catch((error) => {
                req.flash("error_msg", "Houve um erro ao registrar o paciente");
                console.error("Erro ao registar paciente:", error);
                res.redirect("/admin");
            });
    });
    router.get("/pacientes/edit/:id",eAdmin, (req, res) => {
        Paciente.findOne({ _id: req.params.id }).then((paciente) => {
            res.render("admin/editpacientes", { paciente: paciente });
        }).catch((err) => {
            req.flash("error_msg", "Esse paciente não existe");
            res.render("/admin/pacientes");
        });
    });
    router.post("/pacientes/edit",eAdmin,(req,res)=>{
        Paciente.findOne({_id: req.body.id}).then((paciente)=>{
            paciente.nome= req.body.nome
            paciente.email= req.body.email
            paciente.telefone= req.body.telefone
            paciente.cpf= req.body.cpf
            paciente.datanasc= req.body.datanasc
            paciente.logradouro= req.body.logradouro
            paciente.cidade= req.body.cidade
            paciente.estado= req.body.estado
            paciente.save().then(()=>{
                req.flash("success_msg","Dados editados com sucesso")
                res.redirect("/admin/pacientes")
            })
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao editar os dados")
            res.redirect("/admin/pacientes")
        })
    })
    router.post("/pacientes/deletar", eAdmin,(req,res)=>{
        Paciente.deleteOne({_id: req.body.id}).then(()=>{
            req.flash("succes_msg","Paciente excluido com sucesso")
            res.redirect("/admin/pacientes")
        }).catch((err)=>{
            req.flash("error_msg", "Falha ao excluir o paciente")
            res.redirect("/admin/pacientes")
        })
    })

// Atendimentos -----------------------------------------------------------------------//
    router.get("/atendimentos",eAdmin,(req,res)=>{
        Atendimento.find().populate("paciente").sort({data: "desc"}).then((atendimentos)=>{
            res.render("admin/atendimentos",{atendimentos: atendimentos})
        })
    })
    router.get("/atendimentos/add",eAdmin, (req, res) => {
        Paciente.find()
            .then((pacientes) => {
                res.render("admin/addatendimentos", {pacientes: pacientes});
            })
            .catch((err) => {
                req.flash("error_msg", "Falha ao encontrar atendimento");
                res.redirect("/admin");
            });
    });
    router.post("/atendimentos/novo",eAdmin, (req, res) => {
        var erros = []
        if(req.body.paciente == "0"){
            erros.push({texto: "Paciente invalido, registre um paciente"})
        }
        if(erros.length>0){
            res.render("admin/addatendimentos",{erros: erros})
        }else{
            const novoAtendimento = new Atendimento({
                titulo: req.body.titulo,
                turno: req.body.turno,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                paciente: req.body.paciente,
                data: req.body.data
            });
            novoAtendimento.save()
            .then(() => {
                req.flash("success_msg", "Atendimento registrado com sucesso");
                res.redirect("/admin/atendimentos");
            })
            .catch((error) => {
                req.flash("error_msg", "Houve um erro ao cadastrar o atendimento");
                console.error("Erro ao cadastrar atendimento:", error);
                res.redirect("/admin/atendimentos");
            })
        }
    });
    router.post("/atendimentos/deletar",eAdmin, (req,res)=>{
        Atendimento.deleteOne({_id: req.body.id}).then(()=>{
            req.flash("succes_msg","Atendimento deletado com sucesso")
            res.redirect("/admin/atendimentos")
        }).catch((err)=>{
            req.flash("error_msg", "Falha ao deletar o atendimento")
            res.redirect("/admin/atendimentos")
        })
    })
    router.get("/atendimentos/edit/:id",eAdmin,(req,res)=>{
        Atendimento.findOne({_id:req.params.id}).then((Atendimento)=>{
            Paciente.find()
            .then((pacientes) => {
                res.render("admin/editatendimentos", { pacientes: pacientes,Atendimento: Atendimento});
            })
            .catch((err) => {
                req.flash("error_msg", "Falha ao encontrar o paciente");
                res.redirect("/admin/atendimentos");
            });
        }).catch((err)=>{
            req.flash("error_msg","Esse atendimento não existe")
            res.render("/admin/atendimentos")
        })
    })
    router.post("/atendimentos/edit",eAdmin,(req,res)=>{
        Atendimento.findOne({_id: req.body.id}).then((Atendimento)=>{
            Atendimento.titulo= req.body.titulo,
            Atendimento.turno= req.body.turno,
            Atendimento.descricao= req.body.descricao,
            Atendimento.conteudo= req.body.conteudo,
            Atendimento.paciente= req.body.paciente,
            Atendimento.data= req.body.data
            Atendimento.save().then(()=>{
                req.flash("success_msg","Atendimento editado com sucesso")
                res.redirect("/admin/atendimentos")
            })
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao editar o atendimento")
            res.redirect("/admin/atendimentos")
        })
    })
    router.get("/atendimentos/:id",eAdmin, (req, res) => {
        Atendimento.find({ paciente: req.params.id }).populate("paciente").sort({ data: "desc" }).then((atendimentos) => {
            res.render("admin/atendimentos", { atendimentos: atendimentos });
        });
    });

    router.get('/index',eAdmin, (req, res) => {
        res.render('admin/index', { nome: req.user.nome })
    })

module.exports = router;