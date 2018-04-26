
module.exports = {
    name: 'echo',
    
    init: function(app) {
        app.command('/echo', (ctx) => {
            ctx.telegram.sendCopy(ctx.from.id, ctx.message);
        });
    },

    activate: function(ctx) {
        
    },

    help: '/echo <message>'
}