const express = require('express');
const {
    getTasks,
    getTask,
    postTask,
    deleteTask,
    patchTask
} = require('../controllers/taskController');
const { requireAuth } = require('../middleware/requireAuth');
const router = express.Router();

//run middleware
router.use(requireAuth);

//route handlers
//get all tasks
router.get('/', getTasks);

//get a single task
router.get('/:id', getTask);

//post a new task
router.post('/', postTask);

//delete a task
router.delete('/:id', deleteTask);

//patch a task
router.patch('/:id', patchTask);

//export router
module.exports = router;