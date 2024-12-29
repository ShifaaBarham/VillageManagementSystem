import React, { createContext, useReducer} from 'react';
 
const ReducerContext = createContext();

const initialState = {user:{
    username: 'username',
    image: 'part2\src\images\profile-image.png'
}

}

const ReducerProvider = ({Children}) => {
        return(
            <ReducerContext.Provider value={{vellages ,setVellages}}>
                {children}
            </ReducerContext.Provider>
        );
}
export {ReducerContext, ReducerProvider}