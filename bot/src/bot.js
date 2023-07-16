import { Telegraf } from 'telegraf';
import schedule from 'node-schedule';
import fetch from 'node-fetch';
import { format } from 'date-fns';
import 'dotenv/config';
import express from 'express';
import moment from 'moment-timezone';

const app = express()

app.get('/', (req, res) => {
  res.send('req received')
});
app.listen(3000, () => {
  console.log("Server running at port 3000")
});

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

// Define an array to store active chat contexts
const activeContexts = [];

// Define an array to store scheduled jobs
const scheduledJobs = [];

// Function to schedule reminders for a specific context
const scheduleRemindersForContext = async (ctx) => {
  const timezone = ctx.state.user.timezone;
  const tasks = await fetchTasks(ctx.state.user.token);
  const tasksToday = tasks.filter(task => {
    return format(new Date(task.startTime), "do MMM Y") === format(new Date(), "do MMM Y");
  });
  const jobs = []
  // Iterate over the filtered tasks and schedule reminders
  tasksToday.forEach(task => {
    
    const reminderTime = moment.tz(task.startTime, timezone).toDate(); // Convert to user's timezone
    
    console.log(`Scheduling reminder for task: ${task.title} at ${reminderTime}`);
    const job = schedule.scheduleJob(reminderTime, () => {
      sendReminder(ctx, `${task.title} \n
            from *${format(new Date(task.startTime), "hh:mm a")}* on *${format(new Date(task.startTime), "do MMM Y")}* \n
            to *${format(new Date(task.endTime), "hh:mm a")}* on *${format(new Date(task.endTime), "do MMM Y")}* \n
            with tags:${task.tags.map(tag => ` *${tag}* `)}, priority: *${task.priority}*`);
    });
    jobs.push(job);

    // Print information about the scheduled job
    console.log(job);
  });
  scheduledJobs.push({ ref: ctx.chat.id, jobs });
  console.log(`Reminders for today's tasks scheduled for chat ID: ${ctx.chat.id}`);
};

//function to cancel reminders for a specific context
const cancelRemindersForContext = async (ctx) => {
  console.log(scheduledJobs);
  scheduledJobs.forEach(ctx_obj => {
    if (ctx_obj.ref === ctx.chat.id) {
      ctx_obj.jobs.forEach(job => {
        job && job.cancel();
      });
      scheduledJobs.splice(scheduledJobs.indexOf(ctx_obj), 1);
    }

  });
  console.log(`Reminders for today's tasks cancelled for chat ID: ${ctx.chat.id}`);
};


const sendReminder = (ctx, reminderText) => {
  ctx.reply(`⏰ REMINDER: ${reminderText} \n \n in 30 mins`, { parse_mode: 'Markdown' });
};

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Handler for incoming messages to track active chat contexts
bot.on('message', (ctx, next) => {
  if (!activeContexts.includes(ctx)) {
    activeContexts.push(ctx);
    console.log(`Chat ID ${ctx.chat.id} added to active contexts.`);
  }
  next();
});

// Function to schedule reminders for all active chat contexts
const scheduleRemindersForAllContexts = async () => {
  for (const ctx of activeContexts) {
    console.log(`Scheduling reminders for chat ID: ${ctx.chat.id}`);
    await scheduleRemindersForContext(ctx);
  }
};

// Schedule reminders every day at 12 AM
schedule.scheduleJob('0 0 * * *', async () => {
  console.log('Scheduling reminders for all active contexts.');
  await scheduleRemindersForAllContexts();
});

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

bot.start(async (ctx) => {
  await ctx.reply('Welcome to Productivv! You can use the following commands: \n\n /today - View your tasks for today \n /schedule - Schedule reminders for today\'s tasks \n /cancel - Cancel reminders for today\'s tasks');
  await ctx.reply('Reminders are scheduled for tasks at 12 AM everyday.\nIf you have added tasks after 12 AM today, you can use the /schedule command to schedule reminders for them.');
  await ctx.reply('You will receive reminders 30 minutes before the start time of each task.');
  await ctx.reply('Your timezone is set to: ' + ctx.state.user.timezone);
  ctx.reply('You can change your timezone from the user profile page on the productivv web app.');
});

bot.command('schedule', async (ctx) => {
  await cancelRemindersForContext(ctx);
  await scheduleRemindersForContext(ctx);
  ctx.reply('Reminders for today\'s tasks scheduled.');
});

bot.command('cancel', async (ctx) => {
  await cancelRemindersForContext(ctx);
  ctx.reply('Reminders for today\'s tasks cancelled.');
});

bot.command('test', async (ctx) => {
  console.log(scheduledJobs);
})

bot.command('today', async (ctx) => {
  const tasks = await fetchTasks(ctx.state.user.token);
  const tasks_today = tasks.filter(task => {
    return format(new Date(task.startTime), "do MMM Y") === format(new Date(), "do MMM Y");
  });
  if (!tasks_today || tasks_today.length === 0) {
    return ctx.reply('You have no tasks today! Add some tasks on the productivv web app.');
  }
  bot.telegram.sendMessage(ctx.chat.id, 'Would you like to view your tasks by priority or date?',
    {
      reply_markup: {
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
    ctx.reply(`${task.title} \nfrom *${format(new Date(task.startTime), "hh:mm a")}* \non *${format(new Date(task.startTime), "do MMM Y")}* \nto *${format(new Date(task.endTime), "hh:mm a")}* \non *${format(new Date(task.endTime), "do MMM Y")}* \nwith tags:${task.tags.map(tag => ` *${tag}* `)} \npriority: *${task.priority}*`,
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
    ctx.reply(`${task.title} \nfrom *${format(new Date(task.startTime), "hh:mm a")}* \non *${format(new Date(task.startTime), "do MMM Y")}* \nto *${format(new Date(task.endTime), "hh:mm a")}* \non *${format(new Date(task.endTime), "do MMM Y")}* \nwith tags:${task.tags.map(tag => ` *${tag}* `)} \npriority: *${task.priority}*`,
      {
        parse_mode: 'Markdown'
      });
  });
});

bot.launch();

