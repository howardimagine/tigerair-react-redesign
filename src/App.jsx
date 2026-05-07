import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import FlightDetail from './pages/FlightDetail';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Member from './pages/Member';
import Orders from './pages/Orders';
import Tasks from './pages/Tasks';
import CheckIn from './pages/CheckIn';
import Support from './pages/Support';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/flight/:id" element={<FlightDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/member" element={<Member />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
