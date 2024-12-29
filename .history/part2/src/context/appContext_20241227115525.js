import { createContext } from "react"

const AppContext = createContext();

const AppProvider =(children) =>{
    const [vellages ,setVellages] = useState([]);
    return(
        <AppContext.Provider value={{vellages ,setVellages}}>
            {children}
        </AppContext.Provider>
    )
}
export {AppContext, AppProvider}