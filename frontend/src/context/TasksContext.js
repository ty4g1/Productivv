import { createContext, useReducer } from "react";
export const TasksContext = createContext();
export const tasksReducer = (state, action) => {
    switch (action.type) {
        case 'GET_TASKS':
            return {
                tasks: action.payload
            };
        case 'CREATE_TASK': {
            return {
                tasks: [action.payload, ...state.tasks]
            };
        }
        case 'CREATE_TASKS': {
            return {
                tasks: [...action.payload, ...state.tasks]
            };
        }
        case 'DELETE_TASK': {
            return {
                tasks: state.tasks.filter(task => task._id !== action.payload._id)
            }
        }
        case 'DELETE_RECURRING_TASKS': {
            return {
                tasks: state.tasks.filter(task => task.recurr_id !== action.payload)
            }
        }
        case 'PATCH_TASK': {
            return {
                tasks: state.tasks.map(task => task._id !== action.payload._id ? task : action.payload)
            };
        }
        default:
            return state;
    }
};

const TasksContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tasksReducer, {tasks: null}); 

    return ( 
        <TasksContext.Provider value={{tasks: state.tasks, dispatch}}>
            { children }
        </TasksContext.Provider>
     );
};

export default TasksContextProvider;