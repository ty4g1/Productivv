import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
//pages and components
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyCalendar from './pages/Calendar';
import MenuBar from './components/MenuBar';
import RecurringForm from './pages/RecurringForm';
import Completed from './pages/Completed';
import PastDue from './pages/PastDue';
function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      {user && <MenuBar />}
        <div className='pages'>
          <Routes>
            <Route exact path='/' element={user ? <Home /> : <Navigate to='/login'/>} />
            <Route exact path='/calendar' element={user ? <MyCalendar /> : <Navigate to='/login'/>} />
            <Route exact path='/form-recurring' element={user ? <RecurringForm /> : <Navigate to='/login'/>} />
            <Route exact path='/completed' element={user ? <Completed /> : <Navigate to='/login'/>} />
            <Route exact path='/past-due' element={user ? <PastDue /> : <Navigate to='/login'/>} />
            <Route exact path='/login' element={!user ? <Login /> : <Navigate to='/'/>} />
            <Route exact path='/signup' element={!user ? <Signup /> : <Navigate to='/'/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
