import { useEffect } from "react";
import TaskDesc from "../components/TaskDesc"
import TaskForm from "../components/TaskForm";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
    const {tasks, dispatch} = useTasksContext();
    const { user } = useAuthContext();
    useEffect(() => {

        const fetchWorkouts = async () => {
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
            fetchWorkouts();
        }
        
        
    }, [dispatch, user]);

    return ( 
        <div className="home">
            <div className="tasks">
                {console.log(tasks)}
                {(!tasks || !tasks.length) && <div className="no-tasks">
                    <h1>Get started!</h1>
                    <p>Add some tasks</p>
                </div>}
                {tasks && tasks.map(task => (
                    <TaskDesc key={task._id} task={task} /> 
                ))}
                
                
            </div>
            <TaskForm />
        </div>
     );
}
 
export default Home;