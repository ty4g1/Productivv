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

        if (task.recurr_id) {
            window.confirm('This is a recurring task. Do you want to delete all recurring tasks?') && deleteRecurring();
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
                <span className="material-symbols-outlined delete" onClick={handleClickDel}>delete</span>
                <span className="material-symbols-outlined edit" onClick={() => setEdit(true)}>edit</span>
            </div>}
        </div>
     );
}
 
export default TaskDesc;