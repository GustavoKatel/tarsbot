const Markup = require('telegraf/markup')

module.exports = {
    name: 'echo',
    
    init: function(app) {
        app.command('/echo', (ctx) => {
            ctx.telegram.sendCopy(ctx.from.id, ctx.message);
        });
    },

    buttons: [
    ],

    inlineButtons: [
    ],
    
    help: '/echo <message>'
}