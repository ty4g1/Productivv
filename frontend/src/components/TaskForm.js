import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import RecurringForm from "../pages/RecurringForm";
import { Link } from "react-router-dom";

const TaskForm = () => {
    const {dispatch} = useTasksContext();
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [recurring, setRecurring] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in');
            return 
        }
        if (title.trim() === '') {
            setError('Title cannot be empty');
            return
        }

        const task = {title: title.trim(), startTime, endTime};
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
            setStartTime('');
            setEndTime('');
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
                <label>From</label>
                <input type="datetime-local" required onChange={e => setStartTime(e.target.value)} value={startTime}/>
                <label>To</label>
                <input type="datetime-local" required onChange={e => setEndTime(e.target.value)} value={endTime}/>
                <button>Add Task</button>
            </form>
            {error && <div className="error">{error}</div>}
        </div>
        
     );
}
 
export default TaskForm;