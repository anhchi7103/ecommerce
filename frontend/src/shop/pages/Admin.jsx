import React from 'react'
import Sidebar from '../components/Sidebar'
import {Routes, Route} from "react-router-dom"
import Navbar from '../components/Navbar'
import AddProduct from "../components/AddProduct"
import ListProduct from "../components/ListProduct"

const Admin = () => {
    return (
        <div class='lg:flex'>
            <Sidebar />
            <Routes>
                <Route path='/shop/addproduct' element={<AddProduct />}/>
                <Route path='/shop/listproduct' element={<ListProduct />}/>
            </Routes>
        </div>
    )
}

export default Admin