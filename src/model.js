// definition of quiz
const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite:quizzes.sqlite', {logging: false});

sequelize.define('quiz',{
   question: {
       type: Sequelize.STRING,
       unique: {msg: 'Ya existe esta pregunta'},
       validate: {notEmpty: {msg:'la pregunta no puede estar vacia'}}
   },
   answer: {
       type: Sequelize.STRING,
       validate: {notEmpty:{msg: 'La respuesta no puede estar vacia'}}
}
});

sequelize.sync()
    .then(() =>
    sequelize.models.quiz.count())
    .then(count => {
        if(count == 0){
            return sequelize.models.quiz.bulkCreate([
            { question: 'Capital de Italia', answer: 'Roma'},
            { question: 'Capital de Francia', answer:'Paris'},
                {question: 'Capital de España', answer: 'Madrid'},
                {question: 'Capital de Portugal', answer: 'Lisboa'}
            ]);
        }
    })
    .catch(error =>{
       console.log(error);
    });

module.exports = sequelize;

/*const load = () => {
  fs.readFile(DB_FILENAME,(err,data)=>{
    if(err){
        if(err.code ==='ENOENT'){
            save();
            return;
        }
        throw err;
    }
    let json = JSON.parse(data);
    if(json){
        quizzes = json;
    }
  });
};

const save = ()=>{
  fs.writeFile(DB_FILENAME,
      JSON.stringify(quizzes),
      err =>{
      if(err)throw err;
      });
};

exports.count = function () {
    return quizzes.length;
};
exports.add = function (question, answer) {
    quizzes.push({
        question : (question || '').trim(),
        answer : (answer || '').trim()
    });
    save();
};
exports.update = function (id,question, answer) {
    const quiz = quizzes[id];
    if(typeof quiz === 'undefined'){
        throw new Error('El valor del parametro id no es valido');
    }
    quizzes.splice(id,1,{
        question: (question|| '').trim(),
        answer: (answer||'').trim()
    });
    save();
};

exports.getAll = function () {
    return JSON.parse(JSON.stringify(quizzes));
};

exports.getByIndex = function (id) {
    const quiz = quizzes[id];
    if(typeof quiz ==='undefined'){
        throw new Error('El valor del parametro id no es valido');
    }
    return JSON.parse(JSON.stringify(quiz));
};

exports.deleteByIndex = function (id) {
    const quiz = quizzes[id];
    if(typeof quiz ==='undefined'){
        throw new Error('El valor del parametro id no es valido');
    }
    quizzes.splice(id,1);
    save();
};

load();*/