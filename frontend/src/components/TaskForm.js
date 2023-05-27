import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
const TaskForm = () => {
    const {dispatch} = useTasksContext();
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in');
            return 
        }
        const task = {title: title.trim(), time, date};
        const response = await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
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
            setTitle('');
            setTime('');
            setDate('');
            setError(null);
            dispatch({type: 'CREATE_TASK', payload: json});

        }
    }

    return ( 
        
        <div className="task-form">
            <form onSubmit={handleSubmit}>
                <h2>Add new task</h2>
                <label>Title</label>
                <input type="text" required onChange={e => setTitle(e.target.value)} value={title}/>
                <label>Time</label>
                <input type="time" required onChange={e => setTime(e.target.value)} value={time}/>
                <label>Date</label>
                <input type="date" required onChange={e => setDate(e.target.value)} value={date}/>
                <button>Add Task</button>
            </form>
            {error && <div className="error">{error}</div>}
        </div>
        
     );
}
 
export default TaskForm;