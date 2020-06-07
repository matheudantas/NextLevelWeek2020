const express = require("express")
const server = express() //executando a função express em server

// pegar o banco de dados
const db = require("./database/db")

// configurar pasta pública
server.use(express.static("public"))

// habilitar o uso do req.body na aplicação
server.use(express.urlencoded({extended: true}))


// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
// conectar express com o nunjucks
    noCache: true
// não guardar dados em memória
})


// configurar caminhos da minha aplicação
// página inicial
// req: Requisição
// res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título" })
})

server.get("/create-point", (req, res) => {

    //console.log(req.query)


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    // req.body: o corpo do formulário
    // console.log(req.body)

    // inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.city,
        req.body.items
    ]   

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }
        console.log("Cadastro com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)

    
})




server.get("/search", (req, res) => {
    
    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        console.log("Aqui estão os seus registros: ")
        console.log(rows)

        const total = rows.length
        
        // mostrar a página html om os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total})
    }) 
    



})



//ligar o servidor
server.listen(3000)

//numjucks (engine) responsável por deixar html dinâmico