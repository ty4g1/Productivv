import { useEffect} from "react";
import TaskDesc from "../components/TaskDesc"
import TaskForm from "../components/TaskForm";
import { useTasksContext } from "../hooks/useTasksContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFilterContext } from "../hooks/useFilterContext";
import SearchBar from "../components/SearchBar";

const Home = () => {
    const {tasks, dispatch: tasks_dispatch} = useTasksContext();
    const { user } = useAuthContext();
    const { filtered, dispatch: filtered_dispatch } = useFilterContext();
    useEffect(() => {

        const fetchTasks = async () => {
            const response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const tasksArray = await response.json();

            if (response.ok) {
                tasks_dispatch({type: 'GET_TASKS', payload: tasksArray});
                filtered_dispatch({type: 'SET_FILTERED_TASKS', payload: tasksArray});
            }
        }
        if (user) {
            fetchTasks();
        }
        
        
    }, [filtered_dispatch, tasks_dispatch, user]);

    return ( 
        <div>
        <p className="note"><b>Note:</b> Tasks whose end dates have passed, are under the Past Due tab</p><br/>
        <div className="home">
            <div>
                <SearchBar/>
                <div className="tasks">
                    {(!tasks || !tasks.length ||
                    !tasks.filter((task) => !task.completed) || !tasks.filter((task) => !task.completed).length) && 
                    <div className="no-tasks">
                        <h1>Get started!</h1>
                        <p>Add some tasks</p>
                    </div>}
                    {filtered && filtered.map(task => (
                        (task.completed || (new Date(task.endTime) < new Date())) ? null : <TaskDesc key={task._id} task={task} /> 
                    ))}
                    
                    
                </div>
            </div>
            <TaskForm />
        </div>
        </div>
     );
}
 
export default Home;