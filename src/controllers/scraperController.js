let {spawn} = require('child_process');

function chamarApi(req, res){
    var link = req.params.link;

    console.log("LINK: " + link)

    let scriptPython = spawn('python', ['public/js/caca-reclamacao/main.py'], { encoding : 'utf8', stdio: 'ignore' });

    scriptPython.stdout.on('data', (data) => {
        // Saida do console da API
        console.log(`Saida do Terminal: ${data}`)
    });
    
    scriptPython.stderr.on('data', (data) => {
        // Saida de erros da API
        console.log(`Saida do Terminal: ${data}`)
    });
    
    scriptPython.on('close', (code) => {
        // Saida da API
        console.log(`Script Executado!`)
        res.status(204).send("API Executada com sucesso!")
    });
}

module.exports = {
    chamarApi
}