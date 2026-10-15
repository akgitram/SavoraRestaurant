import {  Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Menu from "./pages/Menu";
import WhatsAppButton from "./components/WhatsAppButton";
import AdminMenu from "./pages/AdminMenu";
import Userdashboard from "./pages/Userdashboard";
import AdminUser from "./pages/AdminUser";
import AdminReservation from "./pages/AdminReservation";
import MyReservations from "./pages/MyReservations";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import AminGellery from "./pages/AminGellery";
import AdminCategories from "./pages/AdminCategories";
import Profile from "./pages/Profile";
import AddAdmin from "./pages/AddAdmin";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/menu" element={<Menu/>}></Route>
        <Route path="/about" element={<About/>} />

        <Route path="/gallery" element={<Gallery />} />

        <Route path="/reservation" element={<Reservation />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/menu" element={<AdminMenu/>}/>
        <Route path="/userdashboard" element={<Userdashboard/>}/>
        <Route path="/adminusers" element={<AdminUser/>}/>
        <Route path="/adminreservation" element={<AdminReservation/>}/>
        <Route path="/myreservation"element={<MyReservations/>}/>

        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout"element={<Checkout/>}/>

        <Route path="/orderSuccess" element={<OrderSuccess/>}/>

        <Route path="/my-orders" element={<MyOrders/>}/>
        <Route path="/admin/orders" element={<AdminOrders/>}/>

        <Route path="/admin/gellery" element={<AminGellery/>}/>

        <Route path="/admin/category" element={<AdminCategories/>}/>
        <Route path="/profile" element={<Profile/>}/>

        <Route path="/addadmin" element={<AddAdmin/>}/>

        <Route path="/mail" element={<VerifyEmail/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>



        <Route path="/WhatsAppButton" element={<WhatsAppButton/>}></Route>
      </Routes>
  );
}

export default App;
