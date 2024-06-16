// Modulos
const express = require("express");
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const adminRoutes = require("./routes/admin");
const path = require("path");
require('./models/Atendimento');
const Atendimento = mongoose.model("Atendimento");
require('./models/Paciente');
const Paciente = mongoose.model("Paciente");
const usuarios = require("./routes/usuario");
const passport = require("passport");
require('./config/auth')(passport);
const db = require("./config/db");

// Configuração do Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main', 
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

// Conexão com o MongoDB
mongoose
    .connect(db.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Mongo conectado!"))
    .catch((err) => console.error("Erro ao conectar com o MongoDB:", err));

// Configuração do Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração da sessão
app.use(
    session({
        secret: "bemsecreto",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());
app.use(passport.session());
app.use(flash());

// Middleware para mensagens flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Configuração dos arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas Admin
app.use("/admin", adminRoutes);
app.get('/',(req,res)=>{
    res.render("index")
})
app.use("/usuarios",usuarios);
// Inicialização do servidor
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});