// DEFINITION OF PAINT

const chalk = require('chalk');
const fig = require('figlet');

const colorize = (msg,color)=> {
  if(typeof color !=='undefined'){
      msg = chalk[color].bold(msg);
  }
  return msg;
};

const log = (msg,color)=>{
    console.log(colorize(msg,color));
};

const biglog = (msg,color)=> {
    log(fig.textSync(msg,{horizontalLayout:'full'}), color);
};
const  errorlog = (emsg)=> {
    console.log(`${colorize('Error','red')}: ${colorize(colorize(emsg,'red'),'bgYellowBright')}`);
};

module.exports = {
    log,
    biglog,
    errorlog,
    colorize
};