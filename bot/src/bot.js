require('dotenv').config()

const { format } = require('date-fns');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const fetchUser = async (username) => {
    const response = await fetch('http://localhost:4000/api/user/find/' + username, {
        headers: {
            method: 'GET'
        }
    });
    
    const user = await response.json();
    if (!response.ok) {
        return user.error;
    }
    if (response.ok) {
        return user;
    }

}

const fetchTasks = async (token) => {
    const response = await fetch('https://productivv.onrender.com/api/tasks', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const tasks = await response.json();
    if (!response.ok) {
        return tasks.error;
    }
    if (response.ok) {
        return tasks;
    }
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

console.log('Bot is starting...');

bot.use(async (ctx, next) => {
    ctx.state.user = await fetchUser(ctx.from.username);
    next(ctx);
});

// Basic commands
bot.start((ctx) => {
    ctx.reply('Hi! To get started, enter your Telegram username in the Productivv app, then type /tasks.');
})

bot.help((ctx) => {
    ctx.reply('Please visit https://productivv.netlify.app/help for help!');
})

bot.on(message('sticker'),
    (ctx) => ctx.reply("That's a cool sticker!"));


// Task commands

// bot.command('priority', async (ctx) => {
//     ctx.reply('These are your current tasks by priority:');
//     const tasks = await fetchTasks(ctx.state.user.token);
//     tasks.forEach(task => {
//         ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}`,
//         {
//             parse_mode: 'Markdown'
//         });
//     });
// });

bot.command('tasks', async (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, 'Would you like to view your tasks by priority or date?',
       { reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Priority', callback_data: 'prio' },
                    { text: 'Date', callback_data: 'date' }
                ]
            ]
        }
    })
});

bot.action('prio', async (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('These are your current tasks by priority:');
    const tasks = await fetchTasks(ctx.state.user.token);
    tasks.forEach(task => {
        ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}`,
        {
            parse_mode: 'Markdown'
        });
    });
});

bot.action('date', async (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('These are your current tasks by date:');
    const tasks = await fetchTasks(ctx.state.user.token);
    tasks.forEach(task => {
        ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}`,
        {
            parse_mode: 'Markdown'
        });
    });
});

bot.launch();