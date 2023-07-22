import { useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import {CirclePicker} from 'react-color';
import CreatableSelect from 'react-select/creatable';
import Slider from '@mui/material/Slider';

const options = [
    { value: 'Recreation', label: 'Recreation' },
    { value: 'Work', label: 'Work' },
    { value: 'School', label: 'School' },
    { value: 'Exercise', label: 'Exercise' }
]

const marks = [
    {
      value: 0,
      label: 'Low',
    },
    {
      value: 50,
      label: 'Medium',
    },
    {
      value: 100,
      label: 'High',
    }
];

const TaskForm = () => {
    const {dispatch} = useTasksContext();
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState(null);
    const [color, setColor] = useState('#000000');
    const { user } = useAuthContext();
    const [tags, setTags] = useState([]);
    const [priority, setPriority] = useState(50);
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
        if (startTime > endTime) {
            setError('Start time cannot be after end time');
            return
        }

        const task = {title: title.trim(), startTime, endTime, color, tags: tags.map(tag => tag.value), priority};
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
            setColor('#000000');
            setError(null);
            setTags([]);
            setPriority(50);
            dispatch({type: 'CREATE_TASK', payload: json});

        }
        
    }


    return ( 
        
        <div className="task-form">
            <form onSubmit={handleSubmit}>
                <h2>Add new task</h2>
                <label>Title</label>
                <input data-testid="title" type="text" required onChange={e => setTitle(e.target.value)} value={title}/>
                <label>From</label>
                <input data-testid="start-time" type="datetime-local" required onChange={e => setStartTime(e.target.value)} value={startTime}/>
                <label>To</label>
                <input data-testid="end-time" type="datetime-local" required onChange={e => setEndTime(e.target.value)} value={endTime}/>
                <label>Task Color</label>
                <div data-testid="color" style={{backgroundColor: 'white', padding: '10px', marginTop: '10px', borderRadius: '20px'}}><CirclePicker color={color} onChangeComplete={(color) => setColor(color.hex)}/></div>
                <label style={{marginTop: '10px'}}>Tags</label>
                <div data-testid="tags" style={{marginTop: '10px'}}><CreatableSelect value={tags} className='tags' options={options} closeMenuOnSelect={true} onChange={setTags} isMulti={true}></CreatableSelect></div>
                <label style={{marginTop: '10px'}}>Priority</label>
                <div data-testid="priority" style={{backgroundColor: 'white', padding: '10px 40px', marginTop: '10px', borderRadius: '20px'}}><Slider value={priority} onChange={(event, value, activeThumb) => setPriority(value)} marks={marks} color='secondary'></Slider></div>
                <button>Add Task</button>
            </form>
            {error && <div className="error">{error}</div>}
        </div>
        
        
     );
}
 
export default TaskForm;