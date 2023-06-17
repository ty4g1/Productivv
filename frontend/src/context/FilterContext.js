import { createContext, useReducer } from "react";
export const FilterContext = createContext();
export const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILTERED_TASKS':
            return {
                filtered: action.payload
            };
        default:
            return state;
    }
};

const FilterContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(filterReducer, {filtered: null}); 

    return ( 
        <FilterContext.Provider value={{filtered: state.filtered, dispatch}}>
            { children }
        </FilterContext.Provider>
     );
};

export default FilterContextProvider;