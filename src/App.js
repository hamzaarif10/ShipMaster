import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import RateEstimateForm from './components/RateEstimateForm';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import AccountHome from "./pages/AccountHome";
import ProtectedRoute from './components/ProtectedRoute.js';
import DashboardNav from './components/DashboardNav.js';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // If Bootstrap is installed via npm
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CreateShipment from './pages/CreateShipment.js';
import ShipmentDetailsModal from './modals/ShipmentDetailsModal.js';
import ViewLabels from "./pages/ViewLabels.js"
import AccountDetails from './pages/AccountDetails.js';
import Integrations from './pages/Integrations.js';
import AddPaymentMethod from "./pages/AddPaymentMethod.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

 // Load Stripe with your publishable key
 const stripePromise = loadStripe("pk_test_51QkCtpDHC1AwffPccIdFZDypLEY0aKWdk6af4qDDlwKALLJIVDuqeUcsXY2LHK5yrUPqu8tfFQPbB3YcRSsq6ONM00t568wLim");
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route
          index
          element={
            <>
              <Navbar />
              <HeroSection />
              <BenefitsSection />
              <RateEstimateForm/>
              <Footer />
            </>
          }
        />
        <Route path="/register" element={<div><Navbar/><Register/></div>}/>
        <Route path="/login" element={<div><Navbar/><Login/></div>}/>
        <Route path="/account-home" element={<ProtectedRoute><DashboardNav/><AccountHome /></ProtectedRoute>} />
        <Route path="/create-shipment" element={<ProtectedRoute><DashboardNav/><CreateShipment/><ShipmentDetailsModal/></ProtectedRoute>} />
        <Route path="/view-labels" element={<ProtectedRoute><DashboardNav/><ViewLabels /></ProtectedRoute>} />
        <Route path="/integration" element={<ProtectedRoute><DashboardNav/><Integrations /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><DashboardNav/><AccountDetails /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><DashboardNav/><Elements stripe={stripePromise}><AddPaymentMethod /></Elements></ProtectedRoute>} />
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;


