import Header from "./components/Header"
import Footer from "./components/Footer"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Category from "./pages/Category"
import Cart from "./pages/Cart"
import SignUp from "./pages/Signup"
import Product from "./pages/Product"
import Login from "./pages/Login"
import Admin from "./shop/pages/Admin"
import AddProduct from "./shop/components/AddProduct"
import ListProduct from "./shop/components/ListProduct"
import Navbar from "./shop/components/Navbar"
import Sidebar from "./shop/components/Sidebar"

//import images
import bannermen from "./assets/bannermens.png"
import bannerwomen from "./assets/bannerwomens.png"
import bannerkid from "./assets/bannerkids.png"


// Wrapper to control layout based on location
// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const isShopRoute = path.startsWith("/shop");
  const isSidebarRoute = path === "/shop/addproduct" || path === "/shop/listproduct";

  return (
    <>
      {isShopRoute ? <Navbar /> : <Header />}
      {isSidebarRoute ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1">{children}</div>
        </div>
      ) : (
        children
      )}
      {!isShopRoute && <Footer />}
    </>
  );
};


export default function App() {
  return (
    <main className="bg-primary text-tertiary">
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mens" element={<Category category="men" banner={bannermen} />} />
          <Route path="/womens" element={<Category category="women" banner={bannerwomen} />} />
          <Route path="/kids" element={<Category category="kid" banner={bannerkid} />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart-page" element={<Cart />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* Admin/shop routes */}
          <Route path="/shop/home" element={<Admin />} />
          <Route path="/shop/addproduct" element={<AddProduct />} />
          <Route path="/shop/listproduct" element={<ListProduct />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </main>
  );
}