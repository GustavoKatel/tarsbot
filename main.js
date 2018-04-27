const { Composer } = require('micro-bot')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const app = new Composer()

let config = require('./config.json');

let cmdlets = config.cmdlets.map(src => {
    let cmdlet = require(src);
    cmdlet.init(app);    
    return cmdlet;
});


app.start((ctx) => {
    let buttons = [].concat(cmdlets.map(cmdlet => {
        return cmdlet.buttons || [];
    }));
    
    ctx.reply('👨🏾‍🚀', Markup
    .keyboard(buttons, {
        columns: 3
    })
    .oneTime()
    .resize()
    .extra()
);

});

app.hears(/hey/, ctx => {
    let buttons = [].concat(cmdlets.map(cmdlet => {
        return cmdlet.inlineButtons || [];
    }));

    ctx.reply('👨🏾‍🚀', Markup
        .inlineKeyboard(buttons, {
            columns: 3
        })
        .extra()
    );
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