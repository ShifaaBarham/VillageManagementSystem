import { createContext } from "react"

const AppContext = createContext();


//children have an access to vellages and setVellages
const AppProvider =(children) =>{
    const [vellages ,setVellages] = useState([]);
    return(
        <AppContext.Provider value={{vellages ,setVellages}}>
            {children}
        </AppContext.Provider>
    );
}
export {AppContext, AppProvider};