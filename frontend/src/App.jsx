import Header from "./components/Header"
import Footer from "./components/Footer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Category from "./pages/Category"
import Cart from "./pages/Cart"
import SignUp from "./pages/Signup"
import Product from "./pages/Product"
import Login from "./pages/Login"

//import images
import bannermen from "./assets/bannermens.png"
import bannerwomen from "./assets/bannerwomens.png"
import bannerkid from "./assets/bannerkids.png"

export default function App() {
  return (
    <main className="bg-primary text-tertiary">
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/mens" element={<Category category="men" banner={bannermen}/>}/>
            <Route path="/womens" element={<Category category="women" banner={bannerwomen}/>}/>
            <Route path="/kids" element={<Category category="kid" banner={bannerkid}/>}/>
            <Route path="/product/:productId" element={<Product />}/>
              {/*<Route path=":productId" element={<Product/>}/> */}
            <Route path="/cart-page" element={<Cart />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/login" element={<Login />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  )
}