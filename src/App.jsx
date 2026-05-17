import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SavedTravelersProvider } from './context/SavedTravelersContext';
import { BoardingPassesProvider } from './context/BoardingPassesContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import FlightDetail from './pages/FlightDetail';
import Booking from './pages/Booking';
import PassengerInfo from './pages/PassengerInfo';
import AddOns from './pages/AddOns';
import SavedTravelers from './pages/SavedTravelers';
import BoardingPasses from './pages/BoardingPasses';
import Confirmation from './pages/Confirmation';
import Member from './pages/Member';
import Orders from './pages/Orders';
import Tasks from './pages/Tasks';
import CheckIn from './pages/CheckIn';
import Support from './pages/Support';
import LowFareMap from './pages/LowFareMap';
import Schedule from './pages/Schedule';
import FlightStatus from './pages/FlightStatus';
import Blog from './pages/Blog';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <SavedTravelersProvider>
        <BoardingPassesProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/flight/:id" element={<FlightDetail />} />
              <Route path="/passengers" element={<PassengerInfo />} />
              <Route path="/add-ons" element={<AddOns />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/member" element={<Member />} />
              <Route path="/member/travelers" element={<SavedTravelers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/boarding-passes" element={<BoardingPasses />} />
              <Route path="/support" element={<Support />} />
              <Route path="/fare-map" element={<LowFareMap />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/flight-status" element={<FlightStatus />} />
              <Route path="/blog/:category" element={<Blog />} />
              <Route path="/articles" element={<ArticleList />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        </BoardingPassesProvider>
      </SavedTravelersProvider>
    </AuthProvider>
  );
}

export default App;
