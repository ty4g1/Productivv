import { format } from 'date-fns';
import { useTasksContext } from '../hooks/useTasksContext';
import { useState } from 'react';
import TaskEdit from './TaskEdit';
import { useAuthContext } from '../hooks/useAuthContext';

const TaskDesc = ({task}) => {
    const [edit, setEdit] = useState(false);
    const {dispatch} = useTasksContext();
    const { user } = useAuthContext();
    const deleteRecurring = async () => {
        if (!user) {
            return 
        }
        const response = await fetch('/api/tasks/recurring/' + task.recurr_id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        if (response.ok) {
            dispatch({type: 'DELETE_RECURRING_TASKS', payload: task.recurr_id});
        }
    }
    const handleClickDel = async () => {
        if (!user) {
            return 
        }
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return
        }
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

        if (!task.completed && task.recurr_id) {
            window.confirm('This is a recurring task. Do you want to delete all recurring tasks?') && deleteRecurring();
        }
    }
    const handleClickComplete = async () => {
        if (!user) {
            return
        }
        const response = await fetch('/api/tasks/' + task._id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({completed: true})
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({type: 'PATCH_TASK', payload: json});
        }
    }

    return (
        <div className="task-desc" style={{backgroundColor: task.color}}>
            {edit &&
            <div>
                <TaskEdit task={task} state={{edit, setEdit}}></TaskEdit>
                <span className="material-symbols-outlined edit" onClick={() => setEdit(false)}>close</span>
            </div>}
            {!edit &&
            <div>
                <h2>{task.title}</h2>
                <p>from <b style={{color: "white"}}>{format(new Date(task.startTime), "hh:mm a")}</b> on <b style={{color: "white"}}>{format(new Date(task.startTime), "do MMM Y")}</b></p>
                <p>to <b style={{color: "white"}}>{format(new Date(task.endTime), "hh:mm a")}</b> on <b style={{color: "white"}}>{format(new Date(task.endTime), "do MMM Y")}</b></p>
                <p style={{margin: '10px 0px'}}>Tags: {task.tags.map(tag => <b key={tag} className="tag" style={{color: 'white', border: '1px white solid', margin: '5px', padding: '5px', borderRadius: '20px'}}>{tag} </b>)}</p>
                <p>Priority Score: <b style={{color: "white"}}>{task.priority} ({task.priority < 34 ? 'Low' : task.priority < 67 ? 'Medium' : 'High'})</b></p>
                <span className="material-symbols-outlined delete" onClick={handleClickDel}>delete</span>
                {!task.completed && 
                <div>
                    <button className="complete" onClick={handleClickComplete}>Mark as complete</button>
                    <span className="material-symbols-outlined edit" onClick={() => setEdit(true)}>edit</span>
                </div>}
                
            </div>}
        </div>
     );
}
 
export default TaskDesc;
