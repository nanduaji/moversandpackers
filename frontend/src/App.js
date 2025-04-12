import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Quotes from "./components/Quotes";
import Review from "./components/Review";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import ContactUs from "./components/ContactUs";
import SignupOrLogin from "./components/SignupOrLogin";
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Quotes />
              <Review />
            </>
          }
        />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/signuporlogin" element={<SignupOrLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
