import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState, useEffect } from 'react';
import { useTasksContext } from "../hooks/useTasksContext";
import { useFilterContext } from '../hooks/useFilterContext';
import { useAuthContext } from '../hooks/useAuthContext';

const children = [
    <ToggleButton value="asc">
      <span class="material-symbols-outlined">stat_2</span>
    </ToggleButton>,
    <ToggleButton value="desc">
      <span class="material-symbols-outlined">stat_minus_2</span>
    </ToggleButton>
  ];

const tags = [
    { value: 'Recreation', label: 'Recreation' },
    { value: 'Work', label: 'Work' },
    { value: 'School', label: 'School' },
    { value: 'Exercise', label: 'Exercise' },
    { value: 'None', label: 'None'}
];

const sortby = [
    { value: 'priority', label: 'Priority' },
    { value: 'startTime', label: 'Start Time' },
    { value: 'endTime', label: 'End Time' }
];

const SearchBar = () => {
    const {tasks} = useTasksContext();
    const {filtered, dispatch} = useFilterContext();
    const { user } = useAuthContext();
    const [order, setOrder] = useState('asc');
    const [filter, setFilter] = useState({ value: 'None', label: 'None'});
    const [sort, setSort] = useState({ value: 'startTime', label: 'Start Time' });
    const [search, setSearch] = useState('');
    const handleKeyUp = (e) => {
        setSearch(e.target.value);
    }
    useEffect(() => {
        const fetchFilteredTasks = () => {
            if (!tasks) return;
            const filtered_tasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()) && (filter.value === 'None' || task.tags.includes(filter.value)));
            const sorted_tasks = filtered_tasks.sort((a, b) => {
                if (sort.value === 'priority') {
                    if (order === 'asc') { return (a.priority - b.priority); }
                    else { return (b.priority - a.priority); }
                } else if (sort.value === 'endTime') {
                    if (order === 'asc') { return (new Date(a.endTime) - new Date(b.endTime)); }
                    else { return (new Date(b.endTime) - new Date(a.endTime)); }
                } else {
                    if (order === 'asc') { return (new Date(a.startTime) - new Date(b.startTime)); }
                    else { return (new Date(b.startTime) - new Date(a.startTime)); }
                }
            });
            dispatch({type: 'SET_FILTERED_TASKS', payload: sorted_tasks});
        }
        if (user) {
            fetchFilteredTasks();
        }
    }, [search, filter, sort, order, tasks])

    return ( 
        <div className="searchbar">
            <input type="text" placeholder="Search tasks" onKeyUp={handleKeyUp}/>
            <div className='filter-sort'>
                <label>Sort by</label>
                <Select value={sort} onChange={setSort} isSearchable={false} options={sortby} />
                <label>Filter by tags</label>
                <CreatableSelect value={filter} onChange={setFilter} options={tags} />
                <ToggleButtonGroup onChange={(e, value) => (value !== null) && setOrder(value)}value={order} exclusive={true} orientation="vertical">{children}</ToggleButtonGroup>
            </div>
        </div>
     );
}
 
export default SearchBar;