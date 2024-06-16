if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://LucasMorais:Lcsu251535@sotm.xcm0pkl.mongodb.net/?retryWrites=true&w=majority&appName=SOTM"}
}else{
    module.exports = {mongoURI: "mongodb://127.0.0.1/SOTM"}
}