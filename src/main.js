
const model = require('./model');
const cmd = require('./cmds');
const readline = require('readline');
const {log,biglog,errorlog,colorize} = require('./out');

const net = require("net");

net.createServer(socket => {

    console.log("Se ha conectado un cliente desde " + socket.remoteAddress);

    biglog(socket,'CORE Quiz', 'green');

    const rl = readline.createInterface({
        input: socket,
        output: socket,
        prompt: colorize('quiz > ', 'blue'),
        completer: function (line) {
            const completions = 'h help list show add delete edit test p play credits quit'.split(' ');
            const hits = completions.filter((c) =>  c.startsWith(line) );
            return [hits.length ? hits : completions, line];
        }
    });

    socket
        .on("end" , () => {
            rl.close();
        })
        .on("error", () => {
            rl.close();
        });
    rl.prompt();

    rl.on('line', function(line){
        var comandos = line.trim().split(" ");
        var comando = comandos[0].toLowerCase().trim();
        var indicador = comandos[1];

        switch (comando){
            case '':
                rl.prompt();
                break;
            case "h":
            case "help":
                cmd.help(socket,rl);
                break;
            case 'list':
                cmd.list(socket,rl);
                break;
            case 'show':
                cmd.show(socket,rl,indicador);
                break;
            case 'add':
                cmd.addQuestion(socket,rl);
                break;
            case 'delete':
                cmd.delete(socket,rl,indicador);
                break;
            case 'edit':
                cmd.edit(socket,rl,indicador);
                break;
            case 'test':
                cmd.test(socket,rl,indicador);
                break;
            case 'p':
            case 'play':
                cmd.play(socket,rl);
                break;
            case 'credits':
                cmd.credits(socket,rl);
                break;
            case 'q':
            case 'quit':
                rl.close();
                socket.end();
                break;
            default:
                log(socket,colorize('Error','red') +': El valor del parámetro id no es válido');
                rl.prompt();
                break;
        }
    }).on('close', function() {
        log(socket,'Adios!');
    });
})
.listen(3030);

// EQUIVALENT TO MAIN


