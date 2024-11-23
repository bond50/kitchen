import {createContext, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

const NavigateContext = createContext();

export const NavigateProvider = ({children}) => {
    const navigate = useNavigate();
    return (
        <NavigateContext.Provider value={navigate}>
            {children}
        </NavigateContext.Provider>
    );
};

// PropTypes for NavigateProvider
NavigateProvider.propTypes = {
    children: PropTypes.node.isRequired, // Ensures children are of type node (any valid React child)
};

export const useNavigateContext = () => {
    return useContext(NavigateContext);
};
