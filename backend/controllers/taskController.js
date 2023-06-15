const Task = require('../models/taskModel')
const mongoose = require('mongoose');

//get all tasks
const getTasks = async (req, res) => {
    const user_id = req.user._id;
    const tasks = await Task.find({user_id}).sort({startTime: 1});
    res.status(200).json(tasks);
}

//get single task
const getTask = async (req, res) => {
    const id = req.params.id;
    //if id is invalid
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such task!"});
    }
    const task = await Task.findOne({_id: id});
    //if no such task is there
    if (!task) {
        return res.status(404).json({error: "No such task!"});
    }
    res.status(200).json(task);
}
//post a new task

const postTask = async (req, res) => {
    //add task to database
    const {title, startTime, endTime, recurr_id, color, tags, priority} = req.body;
    if (endTime < startTime) {
        return res.status(400).json({error: "End time cannot be before start time!"});
    }
    try {
        const user_id = req.user._id;
        const task = await Task.create({user_id, title, startTime, endTime, recurr_id, color, tags, priority});
        res.status(200).json(task);    //OK
    } catch (error) {
        res.status(400).json({error: error.message});       //Bad request
    }
};

//delete a task
const deleteTask = async (req, res) => {
    const id = req.params.id;
    //if id is invalid
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such task!"});
    }
    const task = await Task.findOneAndDelete({_id: id});
    //if no such task is there
    if (!task) {
        return res.status(404).json({error: "No such task!"});
    }
    res.status(200).json(task);
}

//delete recurring tasks
const deleteRecurringTasks = async (req, res) => {
    const id = req.params.id;
    const del_tasks = await Task.deleteMany({recurr_id: id, completed: false});
    //if no such task is there
    if (!del_tasks) {
        return res.status(404).json({error: "No such task!"});
    }
    res.status(200).json(del_tasks);
}

//patch a task
const patchTask = async (req, res) => {
    const id = req.params.id;
    const {startTime, endTime} = req.body;
    //if id is invalid
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such task!"});
    }
    if (endTime < startTime) {
        return res.status(400).json({error: "End time cannot be before start time!"});
    }
    const task = await Task.findOneAndUpdate({_id: id}, {$set: req.body});
    //if no such task is there
    if (!task) {
        return res.status(400).json({error: "No such task!"});
    }
    const upd_task = await Task.findOne({_id: id});
    res.status(200).json(upd_task);
}

module.exports = {
    getTasks,
    getTask,
    postTask,
    deleteTask,
    deleteRecurringTasks,
    patchTask
}