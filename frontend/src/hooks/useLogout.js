import { useAuthContext } from "./useAuthContext";
import { useTasksContext } from "./useTasksContext";
export const useLogout = () => {
    const dispatch_tasks = useTasksContext().dispatch;
    const dispatch_auth = useAuthContext().dispatch;
    const logout = () => {
        localStorage.removeItem('user');
        dispatch_auth({type: 'LOGOUT'})
        dispatch_tasks({type: 'GET_TASKS', payload: null})
    }

    return {logout};
}