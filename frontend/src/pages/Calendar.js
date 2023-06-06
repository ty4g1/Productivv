import React, { useEffect } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import {format, parse, startOfWeek, getDay} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuthContext } from '../hooks/useAuthContext';
import TaskForm from '../components/TaskForm';
import { useTasksContext } from "../hooks/useTasksContext";

const locales = {
    "en-IN": require("date-fns/locale/en-IN")
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const MyCalendar = () => {
    const {tasks, dispatch} = useTasksContext();
    const { user } = useAuthContext();
    useEffect(() => {

        const fetchTasks = async () => {
            const response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const tasksArray = await response.json();

            if (response.ok) {
                dispatch({type: 'GET_TASKS', payload: tasksArray});
            }
        }
        if (user) {
            fetchTasks();
        }
        
        
    }, [dispatch, user]);

    const alltasks = tasks.map(task => {
        return {
            title: task.title,
            startTime: new Date(task.startTime),
            endTime: new Date(task.endTime)
        }
    });
    

     return (
        <div className="calendar">
            <div>
            <Calendar localizer={localizer}
                events={alltasks}
                startAccessor="startTime"
                endAccessor="endTime"
                style={{height: 500, margin: "50px"}}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                eventPropGetter={(event) => {
                    return { style: { backgroundColor: "#9d00ff", fontWeight: "bolder", border: "2px solid #3f0065", color: "white", borderRadius: "10px"} }
                  }}/>
            </div>
            <TaskForm />
        </div>
      );
}
 
export default MyCalendar;