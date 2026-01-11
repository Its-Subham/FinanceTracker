import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp"
import Income from "./pages/Dashboard/Income"
import Expense from "./pages/Dashboard/Expense"


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Root/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/income' element={<Income/>}/>
          <Route path='/expense' element={<Expense/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App


const Root = () => {
  // Check if token exists in localStorage
   const isAuthenticate = !!localStorage.getItem('token');

   // If token exists, render children
   return isAuthenticate ? (
     <Navigate to='/dashboard' />
   ) : (
     <Navigate to='/login' />
   );
};