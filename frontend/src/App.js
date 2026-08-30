import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';

import Register from './pages/Register';

import Profile from './pages/Profile';
import CustomerHome from './pages/Customer_home';
import StaffHome from './pages/StaffHome';

function App() {

const { user } = useAuth();

return (

<Router>

<Navbar />

<Routes>

<Route
path="/"
element={
user ? (
<Navigate to={user.role === 'staff' ? '/staff' : '/customer'} />
) : (
<Navigate to="/login" />
)
}
/>

<Route path="/login" element={<Login />} />

<Route path="/register" element={<Register />} />

<Route
path="/profile"
element={user ? <Profile /> : <Navigate to="/login" />}
/>

<Route
path="/customer"
element={user?.role === 'customer' ? <CustomerHome /> : <Navigate to="/login" />}
/>

<Route
path="/staff"
element={user?.role === 'staff' ? <StaffHome /> : <Navigate to="/login" />}
/>

</Routes>

</Router>

);

}

export default App;