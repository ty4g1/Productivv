require('dotenv').config()

const { format } = require('date-fns');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const { _ } = require('underscore');

// Functions for fetching User and Tasks from Productivv
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

console.log('Bot is running');

// Inputs user's Telegram username into fetchUser function - fetches user token and stores it in 'ctx' object
bot.use(async (ctx, next) => {
    ctx.state.user = await fetchUser(ctx.from.username);
    next(ctx);
});

// Basic commands
bot.start((ctx) => {
    ctx.reply('Hi! To get started, enter your Telegram username in the Productivv app, then use /help for more info.');
})

bot.help((ctx) => {
    ctx.reply('To view your tasks, use /tasks. To set-up reminders, use /reminders.');
})

bot.on(message('sticker'),
    (ctx) => ctx.reply("That's a cool sticker!")); // Simple response to sticker messages
    
// Tasks command to easily view tasks through Telegram
/* NOTE: Need help here, priority and deadline buttons don't work properly. sortedTasks array seems to be correct
   but the bot does not display tasks in the correct order. */

bot.command('tasks', async (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, 'Would you like to view your tasks by priority or deadline?',
       { reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Priority', callback_data: 'prio' },
                    { text: 'Deadline', callback_data: 'deadline' }
                ]
            ]
        }
    })
});

bot.action('prio', async (ctx) => { // View tasks by priority
    ctx.answerCbQuery();
    ctx.reply('These are your current tasks by priority:');

    const tasks = await fetchTasks(ctx.state.user.token);
        console.log('Fetched Array', tasks); // FOR DEBUGGING PURPOSES
    const sortedTasks = _.sortBy(tasks, 'priority');
        console.log('Sorted Array', sortedTasks); // FOR DEBUGGING PURPOSES

    sortedTasks.forEach(task => {
        ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}`,
        {
            parse_mode: 'Markdown'
        });
    });
});

bot.action('deadline', async (ctx) => { // View tasks by ending date & time
    ctx.answerCbQuery();
    ctx.reply('These are your current tasks by deadline:');
    const tasks = await fetchTasks(ctx.state.user.token);
    const sortedTasks = _.sortBy(tasks, 'endTime');

    sortedTasks.forEach(task => {
        ctx.reply(`${task.title} from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}*, with tags:${task.tags.map(tag => ` *${tag}* `)}`,
        {
            parse_mode: 'Markdown'
        });
    });
});


bot.launch();