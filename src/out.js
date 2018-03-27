// DEFINITION OF PAINT

const chalk = require('chalk');
const fig = require('figlet');

const colorize = (msg,color)=> {
  if(typeof color !=='undefined'){
      msg = chalk[color].bold(msg);
  }
  return msg;
};

const log = (socket,msg,color)=>{
    socket.write(colorize(msg,color) + "\n");
};

const biglog = (socket,msg,color)=> {
    log(socket,fig.textSync(msg,{horizontalLayout:'full'}), color);
};
const  errorlog = (socket,emsg)=> {
    socket.write(`${colorize('Error','red')}: ${colorize(colorize(emsg,'red'),'bgYellowBright')}` + "\n");
};

module.exports = {
    log,
    biglog,
    errorlog,
    colorize
};