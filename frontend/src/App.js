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
import UserProfile from './pages/UserProfile';
import Verify from './pages/Verify';
import PageNotFound from './pages/PageNotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { user } = useAuthContext();
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      {user && user.verified && <MenuBar />}
        <div className='pages'>
          <Routes>
            <Route exact path='/' element={user && user.verified ? <Home /> : <Navigate to='/login'/>} />
            <Route exxact path='/verify' element={user && !user.verified ? <Verify /> : <Navigate to='/'/>} />
            <Route exact path='/calendar' element={user && user.verified ? <MyCalendar /> : <Navigate to='/login'/>} />
            <Route exact path='/form-recurring' element={user && user.verified ? <RecurringForm /> : <Navigate to='/login'/>} />
            <Route exact path='/completed' element={user && user.verified ? <Completed /> : <Navigate to='/login'/>} />
            <Route exact path='/past-due' element={user && user.verified ? <PastDue /> : <Navigate to='/login'/>} />
            <Route exact path='/login' element={!user ? <Login /> : !user.verified ? <Navigate to='/verify'/> : <Navigate to='/'/>} />
            <Route exact path='/signup' element={!user ? <Signup /> : !user.verified ? <Navigate to='/verify'/> : <Navigate to='/'/>} />
            <Route exact path='/user-profile' element={user && user.verified ? <UserProfile /> : <Navigate to='/login'/>} />
            <Route exact path='/forgot-password' element={!user ? <ForgotPassword /> : !user.verified ? <Navigate to='/verify'/> : <Navigate to='/'/>} />
            <Route exact path='/reset/:token' element={!user ? <ResetPassword/> : !user.verified ? <Navigate to='/verify'/> :<Navigate to='/login'/>}></Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
