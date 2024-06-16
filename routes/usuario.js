const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const {eAdmin} = require("../helpers/eAdmin")
router.get("/registro", (req, res)=>{
    res.render("usuarios/registro")
})

router.post("/registro",(req,res)=>{
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail invalido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha invalida"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas não combinam"})
    }
    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "E-mail já cadastrado")
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        novoUsuario.senha = hash;
                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário registrado com sucesso");
                            res.redirect("/");
                        }).catch(err => {
                            console.error(err);
                        });
                    });
                });
            }
        })

    }
    
})

router.get("/login",(req,res)=>{
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/admin/index",
        failureRedirect: "/usuarios/login",
        failureFlash: true,
    })(req, res, next);
});
router.get('/index', (req, res) => {
    res.render('usuarios/index', { nome: req.user.nome })
})

router.get("/logout",(req,res)=>{
    req.logout(function(){
        req.flash('success_msg',"Deslogado")
        res.redirect("/")
    })
    
})

module.exports= router