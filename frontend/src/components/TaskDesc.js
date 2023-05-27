import { format } from 'date-fns';
import { useTasksContext } from '../hooks/useTasksContext';
import { useState } from 'react';
import TaskEdit from './TaskEdit';
import { useAuthContext } from '../hooks/useAuthContext';
const TaskDesc = ({task}) => {
    const [edit, setEdit] = useState(false);
    const {dispatch} = useTasksContext();
    const { user } = useAuthContext();
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
    }
    return (
        <div className="task-desc">
            {edit && 
            <div>
                <TaskEdit task={task} state={{edit, setEdit}}></TaskEdit>
                <span className="material-symbols-outlined edit" onClick={() => setEdit(false)}>close</span>
            </div>}
            {!edit && 
            <div>
                <h2>{task.title}</h2>
                <p>at {task.time}</p>
                <p>on {format(new Date(task.date), 'do MMM, yyyy')}</p>
                <span className="material-symbols-outlined delete" onClick={handleClickDel}>delete</span>
                <span className="material-symbols-outlined edit" onClick={() => setEdit(true)}>edit</span>
            </div>}
        </div>
     );
}
 
export default TaskDesc;