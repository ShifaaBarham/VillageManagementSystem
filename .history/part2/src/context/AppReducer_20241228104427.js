import React, { createContext, useReducer} from 'react';
 
const ReducerContext = createContext();

const initialState = {user:{
    username: 'username',
    image: 'part2\src\images\profile-image.png'
}

}

const ReducerProvider = ({Children}) => {
    const [state, dispatch] = useReduce(ReducerContext, initialState);

    return(
        <ReducerContext.Provider value={{state ,dispatch}}>
            {children}
        </ReducerContext.Provider>
    );     
}
export {ReducerContext, ReducerProvider}