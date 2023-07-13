require('dotenv').config()
const { format } = require('date-fns');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const fetchUser = async (username) => {
    const response = await fetch('https://productivv.onrender.com/api/user/find/' + username, {
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
        return tasks;
    }
    if (response.ok) {
        return tasks;
    }
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.use(async (ctx, next) => {
    const response = await fetchUser(ctx.from.username);
    if (response.error) {
        return ctx.reply('You are not registered! Go to the user profile page on the productivv web app, and add your telegram username.');
    } else if (response === 'Incorrect telegram username') {
        return ctx.reply('You are not registered! Go to the user profile page on the productivv web app, and add your telegram username.');
    } else {
        ctx.state.user = response;
        return next();
    }
});
bot.start((ctx) => ctx.reply('Welcome!'));



bot.command('today', async (ctx) => {
    const tasks = await fetchTasks(ctx.state.user.token);
    const tasks_today = tasks.filter(task => {
        return format(new Date(task.startTime), "do MMM Y") === format(new Date(), "do MMM Y");
    });
    if (!tasks_today || tasks_today.length === 0) {
        return ctx.reply('You have no tasks today! Add some tasks on the productivv web app.');
    }
    bot.telegram.sendMessage(ctx.chat.id, 'Would you like to view your tasks by priority or date?',
       { reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Priority', callback_data: 'prio' },
                    { text: 'Date', callback_data: 'date' }
                ]
            ]
        }
    });
}); 

bot.action('prio', async (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('These are your current tasks by priority:');
    const tasks = await fetchTasks(ctx.state.user.token);
    const tasks_today = tasks.filter(task => {
        return format(new Date(task.startTime), "do MMM Y") === format(new Date(), "do MMM Y");
    });
    await tasks_today.sort((a, b) => {
        return a.priority - b.priority;
    });
    tasks_today.forEach(task => {
        ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}, priority: *${task.priority}*`,
        {
            parse_mode: 'Markdown'
        });
    });
});

bot.action('date', async (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('These are your current tasks by date:');
    const tasks = await fetchTasks(ctx.state.user.token);
    const tasks_today = tasks.filter(task => {
        return format(new Date(task.startTime), "do MMM Y") === format(new Date(), "do MMM Y");
    });
    await tasks_today.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
    });
    tasks_today.forEach(task => {
        
        ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}, priority: *${task.priority}*`,
        {
            parse_mode: 'Markdown'
        });
    });
});
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

