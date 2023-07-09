import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CreatableSelect from 'react-select/creatable';

const options = [
    { value: 'Recreation', label: 'Recreation' },
    { value: 'Work', label: 'Work' },
    { value: 'School', label: 'School' },
    { value: 'Exercise', label: 'Exercise' }
];

const TaskEdit = ({ task, state }) => {
    const {dispatch} = useTasksContext();
    const [title, setTitle] = useState(task.title);
    const [startTime, setStartTime] = useState(task.startTime);
    const [endTime, setEndTime] = useState(task.endTime);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState(task.tags.map(tag => ({value: tag, label: tag})));
    const [priority, setPriority] = useState(task.priority);
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

        const upd_task = {title: title.trim(), startTime, endTime, tags: tags.map(tag => tag.value), priority};
        const response = await fetch('/api/tasks/' + task._id, {
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
        <div className="task-edit-form" style={{backgroundColor: task.color}}>
            <form onSubmit={handleSubmit}>
                <input data-testid="title" type="text" className="h2-upd" required onChange={e => setTitle(e.target.value)} value={title}/>
                <input data-testid="start-time" type="datetime-local" className="p-upd" required onChange={e => setStartTime(e.target.value)} value={startTime}/>
                <input data-testid="end-time" type="datetime-local" className="p-upd" required onChange={e => setEndTime(e.target.value)} value={endTime}/>
                <div data-testid="tags" style={{margin: '10px 0px', maxWidth: '50%'}}><CreatableSelect value={tags} className='tags' options={options} closeMenuOnSelect={true} onChange={setTags} isMulti={true}></CreatableSelect></div>
                <input data-testid="priority" type="number" min="0" max="100" value={priority} onChange={(e) => setPriority(e.target.value)}/>
                <button className="material-symbols-outlined done">done</button>
            </form>
            {error && <div className="error">{error}</div>}
        </div>
     );
}
 
export default TaskEdit;