import React from 'react'
import Select from 'react-select'
import { useState } from 'react'
import { format } from 'date-fns'
import {useTasksContext} from '../hooks/useTasksContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from "react-router-dom";
import {CirclePicker} from 'react-color';

const options = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
]

const createTasks = (title, freq, start, end, startDate, endDate, color) => {
    const uniqueId = () => {
        const dateString = Date.now().toString(36);
        const randomness = Math.random().toString(36).substr(2);
        return dateString + randomness;
    };
    const tasks = [];
    let inc = 0;
    switch (freq) {
        case 'daily':
            inc = (date) => date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            inc = (date) => date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            inc = (date) => date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            inc = (date) => date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            break;
    }
    const currDate = new Date(startDate);
    const recurr_id = uniqueId();
    while (currDate <= new Date(endDate)) {
        const task = {title: title.trim(), 
                      startTime: format(currDate, "yyyy-MM-dd") + ' ' + start, 
                      endTime: format(currDate, "yyyy-MM-dd") + ' ' + end,
                      recurr_id: recurr_id,
                      color: color};
        tasks.push(task);
        inc(currDate);
    }
    return tasks;
}

const RecurringForm = () => {
    const [freq, setFreq] = useState();
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { user } = useAuthContext();
    const {dispatch} = useTasksContext();
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);
    const [color, setColor] = useState('#000000');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const tasks = createTasks(title, freq.value, start, end, startDate, endDate, color);
        tasks.forEach(async task => {
            console.log(task);
            const response = await fetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(task),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }});
            const json = await response.json();
            if (!response.ok) {
                setError(json.error);
            } else {
                setError(null);
                setFreq(null);
                setStart('');
                setEnd('');
                setStartDate('');
                setEndDate('');
                setTitle('');
                dispatch({type: 'CREATE_TASK', payload: json});
                navigate('/calendar', {replace: true});
            }
        });
    }
    return ( 
    <form onSubmit={handleSubmit} className='task-form-recurring'>
        <h2>Add new recurring tasks</h2>
        <div className='task-form-recurring-content'>
        <label>Title</label>
        <input type="text" required onChange={e => setTitle(e.target.value)} value={title}/>
        <label>Frequency</label>
        <Select value={freq} className='freq' options={options} closeMenuOnSelect={true} onChange={setFreq} isSearchable={false}/>
        <label>Time</label>
        <input type="time" required onChange={e => setStart(e.target.value)} value={start}/> <br />
        <label className='to' style={{fontSize: '1em'}}>to</label> <br />
        <input type="time" required onChange={e => setEnd(e.target.value)} value={end}/>
        <label>Date range</label>
        <input type="date" required onChange={e => setStartDate(e.target.value)} value={startDate}/> <br />
        <label className='to' style={{fontSize: '1em'}}>to</label> <br />
        <input type="date" required onChange={e => setEndDate(e.target.value)} value={endDate}/>
        <label>Task Color</label>
        <div style={{backgroundColor: 'white', padding: '10px', marginTop: '10px', borderRadius: '20px'}}><CirclePicker color={color} onChangeComplete={(color) => setColor(color.hex)}/></div>
        </div>
        <button type="submit">Add</button>
        {error && <p>{error}</p>}
    </form>
    );
}
 
export default RecurringForm;