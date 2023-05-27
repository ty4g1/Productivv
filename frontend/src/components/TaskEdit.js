import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { baseURL } from "../baseURL";
const TaskEdit = ({ task, state }) => {
    const {dispatch} = useTasksContext();
    const [title, setTitle] = useState(task.title);
    const [time, setTime] = useState(task.time);
    const [date, setDate] = useState(task.date);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const upd_task = {title: title.trim(), time, date};
        const response = await fetch(baseURl + '/api/tasks/' + task._id, {
            method: 'PATCH',
            body: JSON.stringify(upd_task),
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        const json = await response.json();
        
        if (!response.ok) {
            setError(json.error);
        }
        if (response.ok) {
            setError(null);
            dispatch({type: 'PATCH_TASK', payload: json});
            state.setEdit(false);
        }
    }
    return ( 
        <div className="task-edit-form">
            <form onSubmit={handleSubmit}>
                <input type="text" className="h2-upd" required onChange={e => setTitle(e.target.value)} value={title}/>
                <input type="time" className="p-upd" required onChange={e => setTime(e.target.value)} value={time}/>
                <input type="date" className="p-upd" required onChange={e => setDate(e.target.value)} value={date}/>
                <button className="material-symbols-outlined">done</button>
            </form>
            {error && <div className="error">{error}</div>}
        </div>
     );
}
 
export default TaskEdit;