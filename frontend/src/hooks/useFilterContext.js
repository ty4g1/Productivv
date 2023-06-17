import { FilterContext } from "../context/FilterContext";
import { useContext } from "react";

export const useFilterContext = () => {
    const context = useContext(FilterContext);

    if (!context) {
        throw Error('useFilterContext must be used inside FilterContextProvider');
    }

    return context;
};