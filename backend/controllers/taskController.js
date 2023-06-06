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
    const {title, startTime, endTime} = req.body;
    try {
        const user_id = req.user._id;
        const task = await Task.create({user_id, title, startTime, endTime});
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
//patch a task
const patchTask = async (req, res) => {
    const id = req.params.id;
    //if id is invalid
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such task!"});
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
    patchTask
}