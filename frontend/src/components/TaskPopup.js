import TaskDesc from "../components/TaskDesc"
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { useTasksContext } from "../hooks/useTasksContext";

const TaskPopup = ({task, state}) => {
    const [event, setEvent] = useState(task);
    const { user } = useAuthContext();
    
    const fetchTask = async () => {
        const response = await fetch('/api/tasks/' + task._id, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const fetched_task = await response.json();

        if (response.ok) {
            setEvent(fetched_task);
        }
    }
    
    return ( 
        <div className='task-popup-wrapper' onClick={async (e) => {
            if (e.target.className === 'task-popup-wrapper' 
                || e.target.classList.contains('delete')) {
                state(false);
            } else if (e.target.classList.contains('done')) {
                await fetchTask();
                state(false);
            }}}>
            <div className='task-popup'>
                <TaskDesc task={event}/>
            </div>
        </div>
     );
}
 
export default TaskPopup;