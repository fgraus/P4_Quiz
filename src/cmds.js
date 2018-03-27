// DEFINITION OF FUNCTIONS
const {log,biglog,errorlog,colorize} = require('./out');
const {models} = require('./model');
const Sequelize = require('sequelize');

exports.help = function (socket,rl) {
    log(socket,'Commandos:\n' +
        ' h|help - Muestra esta ayuda.\n' +
        ' list - Listar los quizzes existentes.\n' +
        ' show <id> - Muestra la pregunta y la respuesta el quiz indicado.\n' +
        ' add - Añadir un nuevo quiz interactivamente.\n' +
        ' delete <id> - Borrar el quiz indicado.\n' +
        ' edit <id> - Editar el quiz indicado.\n' +
        ' test <id> - Probar el quiz indicado.\n' +
        ' p|play - Jugar a preguntar aleatoriamente todos los quizzes.\n' +
        ' credits - Créditos.\n' +
        ' q|quit - Salir del programa.');
    rl.prompt();
};
exports.list = function (socket,rl) {
    models.quiz.findAll()
        .each(quiz =>{
                log(socket,` [${colorize(quiz.id,'magenta')}]: ${quiz.question}`);
        })
        .catch(error => {
            errorlog(socket,error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

const validateId = function (id) {
  return new Sequelize.Promise(function (resolve, reject) {
     if(typeof id === "undefined"){
        reject(new Error(`Falta el parametro <id>`));
     }else{
         id = parseInt(id);
         if(Number.isNaN(id)){
             reject(new Error(`El valor del parámetro <id> no es un número.`))
         }else{
             resolve(id);
         }
     }
  });
};

exports.show = function (socket,rl,id) {

    validateId(id)
        .then(id =>models.quiz.findById(id))
        .then(quiz =>{
           if(!quiz){
               throw new Error(`No existe un quiz asociado al id= ${id}.`);
           }
           log(socket,` [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
        })
        .catch(error => {
            errorlog(socket,error.message)
        })
        .then(() => {
            rl.prompt();
        });
};

const makeQuestion = (rl,text) =>{
   return new Sequelize.Promise((resolve, reject) => {
     rl.question(colorize(text,'red'), answer => {
         resolve(answer.trim());
     });
   });
};




exports.addQuestion = function (socket,rl) {
    makeQuestion(rl,' Introduzca una pregunta: ')
        .then(q => {
            return makeQuestion(rl,' Introduzca la respuesta: ')
                .then(a => {
                   return {question: q, answer: a};
                });
        })
        .then( quiz => {
            return models.quiz.create(quiz);
        })
        .then(quiz => {
            log(socket,` ${colorize('Se ha añadido','magenta')}: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket,'El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(socket,message));
        })
        .catch(error => {
            errorlog(socket,error.message);
        })
        .then(()=>{
           rl.prompt();
        });
};
exports.delete = function (socket,rl,id) {

    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(socket,error.message);
        })
        .then(()=>{
            rl.prompt();
        });
};
exports.edit = function (socket,rl,id) {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if(!quiz){
                throw new Error(`No existe un quiz asociado al id=${id}.`);
            }
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
            return makeQuestion(rl,' Introduza una pregunta: ')
                .then(q => {
                    process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
                    return makeQuestion(rl, ' Introduzca la respuesta: ')
                        .then(a => {
                            quiz.question = q;
                            quiz.answer = a;
                            return quiz;
                        });
                });
        })
        .then( quiz => {
            return quiz.save();
        })
        .then(quiz => {
            log(socket,` Se ha cambiado el quiz ${colorize(quiz.id,'magenta')} por: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}.`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket,'El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(socket,message));
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};
exports.test = function (socket,rl,id) {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if(!quiz){
                throw new Error(`No existe un quiz asociado al id=${id}`);
            }
            return makeQuestion(rl,`${quiz.question}: `)
                .then(answer => {
                    log(socket,'Su respuesta es correcta.');
                    if(0==answer.toUpperCase().trim().localeCompare(quiz.answer.toUpperCase().trim())){
                        biglog(socket,'Correcta','green');
                        log(socket,'correcta');
                    }else{
                        biglog(socket,'Incorrecta','red');
                        log(socket,'Tu vida es incorrecta.');
                    }
                });
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket,'El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
        })
        .catch(error => {
            errorlog(socket,error.message);
        })
        .then(()=>{
            rl.prompt();
        });
};
exports.play = function (socket,rl) {
    let score = 0;
    let toBeResolved;

    models.quiz.findAll()
        .then(quizzes => {
            toBeResolved = quizzes;
            const playOne = function () {
                if(toBeResolved == 0){
                    log(socket,`No hay nada más que preguntar.`);
                    log(socket,`Fin del juego. Aciertos: ${score}`);
                    biglog(socket,score,'magenta');
                    rl.prompt();
                    return;
                }
                id = parseInt(Math.random()*toBeResolved.length);
                let quiz = toBeResolved[id];

                rl.question(colorize(quiz.question +'? ','red'), (answer)=> {
                    log(socket,'Su respuesta es correcta.');
                    if(0==answer.toUpperCase().trim().localeCompare(quiz.answer.toUpperCase().trim())){
                        score++;
                        log(socket,`CORRECTO - Lleva ${score} acierto`);
                        toBeResolved.splice(id,1);
                        playOne();
                    }else{
                        log(socket,`INCORRECTO.`);
                        log(socket,`Tu respuesta es incorrecta. Fin del juego. Aciertos: ${score}`);
                        biglog(socket,score,'magenta');
                        rl.prompt();
                    }
                });
            };
            playOne();
        })
        .catch(error => {
           console.log(error);
            rl.prompt();
        });
};
exports.credits = function (socket,rl) {
    log(socket,'Autor de la práctica:\n' +
        colorize('Fernando Graus Launa','green'));
    rl.prompt();
};