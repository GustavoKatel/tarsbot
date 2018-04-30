const Markup = require('telegraf/markup')

const cbAnswerMiddleware = (ctx, next) => {
    ctx.answerCbQuery();
    next();
};

const dd = (date) => {
    if(date) {
        return date.toLocaleString();
    }

    return '-';
}

const pomodoro = {
    name: 'pomodoro',

    pomodoroConfig: {
        start: null,
        lunchStart: null,
        lunchEnd: null,
        end: null
    },

    intervalCheckerHandle: null,

    intervalChecker: (ctx) => {
        let start = pomodoro.pomodoroConfig.lunchStart;
        if(!start) {
            if (pomodoro.intervalCheckerHandle) {
                clearInterval(pomodoro.intervalCheckerHandle);
                pomodoro.intervalCheckerHandle = null;
            }
            return;
        }

        let end = pomodoro.pomodoroConfig.lunchEnd || new Date();
        
        // Check if we reached 30min
        let diff = ((end - start) / 1000) / 60;
        if(diff >= 30) {
            ctx.replyWithMarkdown('🍴 *30min lunch interval reached*');
            if (pomodoro.intervalCheckerHandle) {
                clearInterval(pomodoro.intervalCheckerHandle);
                pomodoro.intervalCheckerHandle = null;
            }
        }
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

                pomodoro.intervalCheckerHandle = setInterval(
                    pomodoro.intervalChecker,
                    1000*60,
                    ctx
                );
                
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

        let queryMiddleware = (ctx) => {
            let msg = '🍎 *Pomodoro Status*\n\n';

            msg += `*Start*: ${dd(pomodoro.pomodoroConfig.start)}\n\n`;
            msg += `*Lunch Start*: ${dd(pomodoro.pomodoroConfig.lunchStart)}\n\n`;

            let lunchInterval = 0;
            if (pomodoro.pomodoroConfig.lunchStart) {
                // Lunch has started and finished
                // Diff in minutes
                let end = pomodoro.pomodoroConfig.lunchEnd || new Date();
                let diff = Math.abs(end - pomodoro.pomodoroConfig.lunchStart);
                lunchInterval = Math.floor((diff / 1000) / 60);
            }
            msg += `_Interval_: ${lunchInterval}min\n\n`;

            msg += `*Lunch End*: ${dd(pomodoro.pomodoroConfig.lunchEnd)}\n\n`;
            msg += `*End*: ${dd(pomodoro.pomodoroConfig.end)}\n\n`;

            let total = 0;

            if (pomodoro.pomodoroConfig.start) {
                let end = pomodoro.pomodoroConfig.end || new Date();
                let diff = Math.abs(end - pomodoro.pomodoroConfig.start);
                total = Math.floor((diff / 1000) / 60);
                total -= lunchInterval;
            }

            let h = Math.floor(total / 60);
            msg += `_Total_: ${h}h${total % 60}m\n`;

            ctx.replyWithMarkdown(msg);
        };
        app.action(
            '/pomodoro query',
            cbAnswerMiddleware,
            queryMiddleware
        );
        app.hears('🍎?', queryMiddleware);
    },

    buttons: [
        '🍎',
        '🍎?'
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