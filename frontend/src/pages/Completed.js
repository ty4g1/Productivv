import { useEffect } from "react";
import TaskDesc from "../components/TaskDesc"
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Completed = () => {
    const {tasks, dispatch} = useTasksContext();
    const { user } = useAuthContext();
    useEffect(() => {
        const delTask = async (task) => {
            const response = await fetch('/api/tasks/' + task._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            const json = await response.json();
    
            if (response.ok) {
                dispatch({type: 'DELETE_TASK', payload: json});
            }
        }
        const fetchTasks = async () => {
            const response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const tasksArray = await response.json();

            if (response.ok) {
                dispatch({type: 'GET_TASKS', payload: tasksArray});
            }
        }
        if (user) {
            fetchTasks();
            if (tasks && tasks.length) {
                tasks.filter((task) => task.completed).forEach(async (task) => {
                if ((new Date()).getTime() - (new Date(task.updatedAt)).getTime() > 604800000) {
                    await delTask(task);
                }});
            }
        }
        
    }, [dispatch, user, tasks]);
    const handleClear = async (e) => {
        e.preventDefault();
        if (!tasks.filter((task) => task.completed).length) {
            return;
        }
        if (!window.confirm('Are you sure you want to clear all completed tasks?')) {
            return;
        }
        tasks.filter((task) => task.completed).forEach(async (task) => {
            await fetch('/api/tasks/' + task._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
        });
        dispatch({type: 'CLEAR_COMPLETED'});
    }
    return ( 
        <div className="completed">
            <p className="note"><b>Note:</b> Tasks/Events are deleted after 1 week of being marked as complete</p>
            <button onClick={handleClear}>Clear Completed</button>
            <div className="tasks">
            {(!tasks.filter((task) => task.completed) || !tasks.filter((task) => task.completed).length) && 
                <div className="no-tasks">
                    <h1>Be Productivv!</h1>
                    <p>Complete some tasks</p>
                </div>}
                {tasks && tasks.map(task => (
                    !task.completed ? null : <TaskDesc key={task._id} task={task} /> 
                ))}
            </div>
        </div>
     );
}
 
export default Completed;