import { useEffect } from "react";
import TaskDesc from "../components/TaskDesc"
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const PastDue = () => {
    const {tasks, dispatch} = useTasksContext();
    const { user } = useAuthContext();
    useEffect(() => {

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
        }
        
        
    }, [dispatch, user]);
    const handleClear = async (e) => {
        e.preventDefault();
        if (!tasks.filter((task) => new Date(task.endTime) < new Date()).length) {
            return;
        }
        if (!window.confirm('Are you sure you want to clear all past due tasks?')) {
            return;
        }
        tasks.filter((task) => new Date(task.endTime) < new Date()).forEach(async (task) => {
            await fetch('/api/tasks/' + task._id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            dispatch({type: 'DELETE_TASK', payload: task});
        });
    }
    return ( 
        <div className="pastdue">
            <button className='clear' onClick={handleClear}>Clear Past Due</button>
            <div className="tasks">
            {(!tasks.filter((task) => new Date(task.endTime) < new Date()) 
              || !tasks.filter((task) => new Date(task.endTime) < new Date()).length) && 
                <div className="no-tasks">
                    <h1>Well done!</h1>
                    <p>No missed tasks</p>
                </div>}
                {tasks && tasks.map(task => (
                    !(new Date(task.endTime) < new Date()  && !task.completed) ? null : <TaskDesc key={task._id} task={task} /> 
                ))}
            </div>
        </div>
     );
}
 
export default PastDue;