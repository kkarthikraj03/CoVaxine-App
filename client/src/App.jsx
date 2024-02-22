import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserContextProvider from "./context/UserContextProvider";
import Home from "./components/Home";
import CentreList from "./components/CentreList";
import NavBar from "./components/NavBar";
import Description from "./components/Description";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

function App() {
  return (
    <UserContextProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/centres' element={<CentreList />} />
          <Route path='/details/:centreId' element={<Description />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
        </Routes>
        <Footer />
      </Router>
    </UserContextProvider>
  )
}

export default App
