
const model = require('./model');
const cmd = require('./cmds');
const readline = require('readline');

const {log,biglog,errorlog,colorize} = require('./out');

// EQUIVALENT TO MAIN

biglog('CORE Quiz', 'green');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize('quiz > ', 'blue'),
    completer: function (line) {
        const completions = 'h help list show add delete edit test p play credits quit'.split(' ');
        const hits = completions.filter((c) =>  c.startsWith(line) );
        return [hits.length ? hits : completions, line];
    }
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
            cmd.help(rl);
            break;
        case 'list':
            cmd.list(rl);
            break;
        case 'show':
            cmd.show(rl,indicador);
            break;
        case 'add':
            cmd.addQuestion(rl);
            break;
        case 'delete':
            cmd.delete(rl,indicador);
            break;
        case 'edit':
            cmd.edit(rl,indicador);
            break;
        case 'test':
            cmd.test(rl,indicador);
            break;
        case 'p':
        case 'play':
            cmd.play(rl);
            break;
        case 'credits':
            cmd.credits(rl);
            break;
        case 'q':
        case 'quit':
            rl.close();
            break;
        default:
            log(colorize('Error','red') +': El valor del parámetro id no es válido');
            rl.prompt();
            break;
    }
}).on('close', function() {
    log('Adios!');
process.exit(0);
});
