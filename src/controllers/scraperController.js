function chamarApi(req, res){

    var link = req.body.linkSolicitado;
    
    console.log("TESTE 500000: " + link)

    if(link == undefined){
        res.status(400).send("NAO TA CHEGANDO AQ NAO");
    }else if(link == null){
        res.status(400).send("CHEGOU VAZIO FI")
    }else{
        let {spawn} = require('child_process');

        console.log("TESTE 2: " + link);

        let scriptPython = spawn('python', ['public/js/caca-reclamacao/main.py', String(link)], { encoding : 'utf8'});
    
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
    
}

module.exports = {
    chamarApi
}