const Markup = require('telegraf/markup')

const cbAnswerMiddleware = (ctx, next) => {
    ctx.answerCbQuery();
    next();
};

const pomodoro = {
    name: 'pomodoro',

    pomodoroConfig: {
        start: null,
        lunchStart: null,
        lunchEnd: null,
        end: null
    },
    
    init: (app) => {

        app.hears('🍎', ctx => {
            ctx.replyWithMarkdown('🍎 *Pomodoro*', Markup
                .inlineKeyboard(pomodoro.inlineButtons, {
                    columns: 3
                })
                .extra()
            );
        });
        
        app.action('/pomodoro start',
            cbAnswerMiddleware,
            (ctx) => {
                ctx.reply('Starting pomodoro...');
                pomodoro.pomodoroConfig.start = new Date();
                pomodoro.pomodoroConfig.lunchStart = null;
                pomodoro.pomodoroConfig.lunchEnd = null;
                pomodoro.pomodoroConfig.end = null;
            }
        );
        
        app.action('/pomodoro lunch',
        cbAnswerMiddleware,
        (ctx) => {
            ctx.reply('Starting pomodoro lunch...');
                pomodoro.pomodoroConfig.lunchStart = new Date();
            }
        );
        
        app.action('/pomodoro lunch-end',
        cbAnswerMiddleware,
        (ctx) => {
            ctx.reply('Ending pomodoro lunch...');
                pomodoro.pomodoroConfig.lunchEnd = new Date();
            }
        );
        
        app.action('/pomodoro end',
        cbAnswerMiddleware,
        (ctx) => {
            ctx.reply('Ending pomodoro...');
                pomodoro.pomodoroConfig.end = new Date();
            }
        );

        app.action(
            '/pomodoro query',
            cbAnswerMiddleware,
            (ctx) => {
                let msg = '🍎 *Pomodoro Status*\n';

                msg += `*Start*: ${pomodoro.pomodoroConfig.start || '-'}\n`;
                msg += `*Lunch Start*: ${pomodoro.pomodoroConfig.lunchStart || '-'}\n`;
                
                let lunchInterval = 0;
                if(pomodoro.pomodoroConfig.lunchStart) {
                    // Lunch has started and finished
                    // Diff in minutes
                    let end = pomodoro.pomodoroConfig.lunchEnd || new Date();
                    let diff = Math.abs(end - pomodoro.pomodoroConfig.lunchStart);
                    lunchInterval = Math.floor((diff / 1000) / 60);
                }
                msg += `_Interval_: ${lunchInterval}min\n`;
                
                msg += `*Lunch End*: ${pomodoro.pomodoroConfig.lunchEnd || '-'}\n`;
                msg += `*End*: ${pomodoro.pomodoroConfig.end || '-'}\n`;
                
                let total = 0;

                if(pomodoro.pomodoroConfig.start) {
                    let end = pomodoro.pomodoroConfig.end || new Date();
                    let diff = Math.abs(end - pomodoro.pomodoroConfig.start);
                    total = Math.floor((diff / 1000) / 60);
                }
                
                let h = Math.floor(total/60);
                msg += `_Total_: ${h}h${total%60}m\n`;
                
                ctx.replyWithMarkdown(msg);
            }
        );
    },

    buttons: [
        '🍎',
    ],

    inlineButtons: [
        Markup.callbackButton('🍎', '/pomodoro start'),
        Markup.callbackButton('🍴', '/pomodoro lunch'),
        Markup.callbackButton('🍴⏱', '/pomodoro lunch-end'),
        Markup.callbackButton('🍎⏱', '/pomodoro end'),
        Markup.callbackButton('🍎?', '/pomodoro query'),
    ],
    
    help: '/echo <message>'
};

module.exports = pomodoro;