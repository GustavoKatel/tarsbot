const { Composer } = require('micro-bot')
const app = new Composer()

let config = require('./config.json');

let cmdlets = config.cmdlets.map(src => {
    let cmdlet = require(src);
    cmdlet.init(app);    
    return cmdlet;
});

app.start((ctx) => {
    ctx.reply('Welcome')
});
app.help((ctx) => {
    let message = '*# Cmdlets*\n\n';

    cmdlets.forEach(cmdlet => {
        message += `- *${cmdlet.name}*\n\t${cmdlet.help}\n`;
    });
    
    ctx.replyWithMarkdown(message);
});

// Export bot handler
module.exports = app