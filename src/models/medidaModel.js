var database = require("../database/config");

function buscarMaquinas(){
    var query = '';

    if (process.env.AMBIENTE_PROCESSO == "producao") {

        // ADAPTAR

        query = `SELECT * FROM Maquina;`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM Maquina;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function listarMetricas(){
    var query = '';

    if (process.env.AMBIENTE_PROCESSO == "producao") {

        // ADAPTAR

        query = `SELECT * FROM metrica;`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM metrica;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarServidores(idEmpresa){
    var query = ``;

    if(process.env.AMBIENTE_PROCESSO == "producao") {
        query = `SELECT * FROM Maquina WHERE fkEmpresa = ${idEmpresa};`;
    }else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        query = `SELECT * FROM Maquina WHERE fkEmpresa = ${idEmpresa};`;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}


function buscarComponentesMaquina(idEmpresa, idMaquina){
    var query = ``;

    if(process.env.AMBIENTE_PROCESSO == "producao") {
        //TALVEZ PRECISE ADAPTAR
        query = `SELECT fkComponente FROM DadosServidor WHERE idMaquina = ${idMaquina} AND idEmpresa = ${idEmpresa} GROUP BY fkComponente;`;
    }else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        query = `SELECT fkComponente FROM DadosServidor WHERE idMaquina = ${idMaquina} AND idEmpresa = ${idEmpresa} GROUP BY fkComponente;`;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarUltimosRegistros(idEmpresa, idMaquina, fkComponente, limite_linhas) {

    var query = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        // ADAPTAR SE PRECISAR
        query = `SELECT TOP ${limite_linhas} * FROM DadosServidor 
        WHERE idEmpresa = ${idEmpresa} AND idMaquina = ${idMaquina} AND fkComponente = ${fkComponente} ORDER BY idRegistro;`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM DadosServidor 
                    WHERE idEmpresa = ${idEmpresa} AND idMaquina = ${idMaquina} AND fkComponente = ${fkComponente} ORDER BY idRegistro LIMIT ${limite_linhas};`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarRegistroTempoReal(idEmpresa, idMaquina, fkComponente) {

    var query = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        // ADAPTAR SE PRECISAR
        query = `SELECT TOP 1 * FROM DadosServidor 
            WHERE idEmpresa = ${idEmpresa} AND idMaquina = ${idMaquina} AND fkComponente = ${fkComponente} ORDER BY idRegistro DESC`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM DadosServidor 
                    WHERE idEmpresa = ${idEmpresa} AND idMaquina = ${idMaquina} AND fkComponente = ${fkComponente} ORDER BY idRegistro DESC LIMIT 1;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function mediaUsoComponente(){
    var query = '';

    if (process.env.AMBIENTE_PROCESSO == "producao") {

        // ADAPTAR

        query = `SELECT * FROM MediaUsoComponente;`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM MediaUsoComponente;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function infoMaquina(idMaquina){
    var query = '';

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        query = `SELECT * FROM InfoMaquina WHERE idMaquina = ${idMaquina}`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `SELECT * FROM InfoMaquina WHERE idMaquina = ${idMaquina}`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);

}

function cadastrarMetrica(minimo, maximo, idEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():");

    var instrucao = ``;

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucao = `
            INSERT INTO Metrica (capturaMin, capturaMax) VALUES ('${minimo}','${maximo}');
        `;
    }else if(process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        instrucao = `
            INSERT INTO Metrica (capturaMin, capturaMax) VALUES ('${minimo}','${maximo}');        
        `;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function atribuirMetrica(idMaquina, nomeComponente, idMetrica) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():");

    var instrucao = ``;

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucao = `
        update componente set fkMetrica = ${idMetrica} where fkMaquina = ${idMaquina} and nomeComponente like '${nomeComponente}%';

        `;
    }else if(process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        instrucao = `
        update componente set fkMetrica = ${idMetrica} where fkMaquina = ${idMaquina} and nomeComponente like '${nomeComponente}%';
       
        `;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function buscarMonitorados(idUsuario){
    var query = ``;

    if(process.env.AMBIENTE_PROCESSO == "producao") {
        query = `select MAX(Maquina.nome), count(Relatorio.fkMaquina) from Relatorio join Maquina on idMaquina = fkMaquina where fkUsuario=${idUsuario} group by Relatorio.fkMaquina;

        `;
    }else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        query = `select maquina.nome, count(relatorio.fkMaquina) from relatorio join maquina on idMaquina = fkMaquina where fkUsuario=${idUsuario} group by relatorio.fkMaquina;

        `;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarComponentesMaquinaPorUser(idUsuario, idMaquina){
    var query = ``;

    if(process.env.AMBIENTE_PROCESSO == "producao") {
        //TALVEZ PRECISE ADAPTAR
        query = `SELECT idComponente FROM Componente join Maquina on Componente.fkMaquina = idMaquina join Empresa on idEmpresa = maquina.fkEmpresa join Usuario on idEmpresa = Usuario.fkEmpresa where idMaquina = ${idMaquina} and idUsuario = ${idUsuario}`;
    }else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento"){
        query = `SELECT idComponente FROM componente join maquina on componente.fkMaquina = idMaquina join empresa on idEmpresa = maquina.fkEmpresa join usuario on idEmpresa = usuario.fkEmpresa where idMaquina = '${idMaquina}' and idUsuario = '${idUsuario}'`;
    }else{
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }
    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function qtdRegistrosPorUser(idUsuario, idMaquina) {

    var query = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        // ADAPTAR SE PRECISAR
        query = `select sum(numeroRegistros) as qtdDados, (SELECT FORMAT (momento, 'dd/MM/yyyy')) AS 'dia' from dados join componente on dados.fkComponente = idComponente join maquina on idMaquina = componente.fkMaquina join relatorio on idMaquina = relatorio.fkMaquina where idMaquina= ${idMaquina} and relatorio.fkUsuario = ${idUsuario} and momento >=(select top 1 inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by inicio) and momento <= (select top 1 inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by fim desc) group by FORMAT (momento, 'dd/MM/yyyy') order by dia;`;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `select sum(numeroRegistros) as qtdDados, DATE_FORMAT(momento, '%d/%m/%Y') as dia from dados join componente on dados.fkComponente = idComponente join maquina on idMaquina = componente.fkMaquina join relatorio on idMaquina = relatorio.fkMaquina where idMaquina=${idMaquina} and relatorio.fkUsuario = ${idUsuario} and momento >=(select inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by inicio limit 1) and momento <= (select inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by final desc limit 1) group by DATE_FORMAT(momento, '%d/%m/%Y') order by momento;`;

    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

function buscarUltimosRegistrosUser(idUsuario, idMaquina, fkComponente, limite_linhas) {

    var query = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        // ADAPTAR SE PRECISAR
        query = `select top 50 registro, FORMAT (momento, 'dd/MM/yyyy hh:mm:ss ') as momento from dados join componente on dados.fkComponente = idComponente join maquina on idMaquina = componente.fkMaquina join relatorio on idMaquina = relatorio.fkMaquina where idComponente = ${fkComponente} and relatorio.fkUsuario = ${idUsuario} and momento >=(select top 1 inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by inicio) and momento <= (select top 1 inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by fim desc) order by momento desc;
        `;
    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        query = `select registro, DATE_FORMAT(momento,'%d/%m/%Y %H:%i:%s') as momento from dados join componente on dados.fkComponente = idComponente join maquina on idMaquina = componente.fkMaquina join relatorio on idMaquina = relatorio.fkMaquina where idComponente = ${fkComponente} and relatorio.fkUsuario = ${idUsuario} and momento >=(select inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by inicio limit 1) and momento <= (select inicio from relatorio where relatorio.fkUsuario = ${idUsuario} order by final desc limit 1) order by momento desc limit 50;
        `;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + query);
    return database.executar(query);
}

// function buscarUltimasMedidas(idAquario, limite_linhas) {

//     instrucaoSql = ''

//     if (process.env.AMBIENTE_PROCESSO == "producao") {
//         instrucaoSql = `select top ${limite_linhas}
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,  
//                         momento,
//                         FORMAT(momento, 'HH:mm:ss') as momento_grafico
//                     from medida
//                     where fk_aquario = ${idAquario}
//                     order by id desc`;
//     } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
//         instrucaoSql = `select 
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,
//                         momento,
//                         DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico
//                     from medida
//                     where fk_aquario = ${idAquario}
//                     order by id desc limit ${limite_linhas}`;
//     } else {
//         console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
//         return
//     }

//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }

// function buscarMedidasEmTempoReal(idAquario) {

//     instrucaoSql = ''

//     if (process.env.AMBIENTE_PROCESSO == "producao") {
//         instrucaoSql = `select top 1
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,  
//                         CONVERT(varchar, momento, 108) as momento_grafico, 
//                         fk_aquario 
//                         from medida where fk_aquario = ${idAquario} 
//                     order by id desc`;

//     } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
//         instrucaoSql = `select 
//         dht11_temperatura as temperatura, 
//         dht11_umidade as umidade,
//                         DATE_FORMAT(momento,'%H:%i:%s') as momento_grafico, 
//                         fk_aquario 
//                         from medida where fk_aquario = ${idAquario} 
//                     order by id desc limit 1`;
//     } else {
//         console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
//         return
//     }

//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }


module.exports = {
    buscarMaquinas,
    buscarComponentesMaquina,
    buscarUltimosRegistros,
    buscarRegistroTempoReal,
    mediaUsoComponente,
    buscarServidores,
    infoMaquina,
    cadastrarMetrica,
    atribuirMetrica,
    listarMetricas,
    buscarMonitorados,
    buscarComponentesMaquinaPorUser,
    qtdRegistrosPorUser,
    buscarUltimosRegistrosUser
    // buscarUltimasMedidas,
    // buscarMedidasEmTempoReal
}
