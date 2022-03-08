import React, { } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";

import PrivateRoute from './PrivateRoute'
import UseToken from './UseToken'
import LoginPage from './components/LoginPage'
import HomePage from './components/HomePage'
import SurveyPage from "./components/SurveyPage";
import "./style.css";

function App() {

  const { token, setToken } = UseToken();

  if(!token) {
    return <LoginPage />
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Routes >
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/' element={<HomePage/>}/>
          </Route>
          <Route path='/survey' element={<PrivateRoute/>}>
            <Route path='/survey' element={<SurveyPage/>}/>
          </Route>
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
export default App;