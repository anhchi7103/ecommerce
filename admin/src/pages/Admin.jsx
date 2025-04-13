import React from 'react'
import Sidebar from '../components/Sidebar'
import {Routes, Route} from "react-router-dom"
import AddProduct from "../components/AddProduct"
import ListProduct from "../components/ListProduct"

const Admin = () => {
    return (
        <div class='lg:flex'>
            <Sidebar />
            <Routes>
                <Route path='/addproduct' element={<AddProduct />}/>
                <Route path='/listproduct' element={<ListProduct />}/>
            </Routes>
        </div>
    )
}

export default Admin