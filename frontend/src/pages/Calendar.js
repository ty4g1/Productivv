import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {format, parse, startOfWeek, getDay} from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuthContext } from '../hooks/useAuthContext';
import TaskForm from '../components/TaskForm';

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
    const [newEvent, setNewEvent] = useState({title: "", start: "", end: ""});
    const [allEvents, setAllEvents] = useState([]);

     return (
        <div className="calendar">
            <div>
            <Calendar localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                style={{height: 500, margin: "50px"}}/>
            </div>
            <TaskForm />
        </div>
      );
}
 
export default MyCalendar;