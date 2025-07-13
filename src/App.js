import MainPage from "./components/mainPage";
import React, { useEffect, useState } from "react";
import Loader from "./pages/loading";
function App() {
  const [loading, setLoading] = useState(true);
  
      useEffect(() => {
          const timer = setTimeout(() => {
              setLoading(false);
          }, 5000); 
  
          return () => clearTimeout(timer); 
       })
  
      return (
          loading ? <Loader /> : <MainPage/>
       )
}

export default App;
