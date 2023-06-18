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
bot.use(async (ctx, next) => {
    ctx.state.user = await fetchUser(ctx.from.username);
    next(ctx);
});
bot.start((ctx) => ctx.reply('Welcome!'));
bot.command('tasks', async (ctx) => {
    ctx.reply('These are your current tasks:');
    const tasks = await fetchTasks(ctx.state.user.token);
    tasks.forEach(task => {
        ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}`,
        {
            parse_mode: 'Markdown'
        });
    });
});
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

