import React, { useState } from 'react'
import upload_area from "../../assets/upload_area.svg"
import Sidebar from './Sidebar'
import { MdAdd } from "react-icons/md"

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        images: "",
        category: "Women",
        price: "",
        stock: "",
        description: "",
        shop_id: "10"
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0])
    }

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
    }

    const Add_Product = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product', image);

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => { responseData = data })

        if (responseData.success) {
            product.images = responseData.image_url;
            console.log(product)
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product),
            }).then((resp) => resp.json()).then((data) => {
                data.success ? alert("Product Added") : alert("Upload Failed")
            })
        }
    }

    return (
        <div className='p-5 box-border bg-white rounded-sm mt-4 lg:m-7'>
            <div className='mb-3'>
                <h4 className='bold-18 pb-2'>Product title:</h4>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here...' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
            </div>
            <div className='mb-3'>
                <h4 className='bold-18 pb-2'>Price:</h4>
                <input value={productDetails.price} onChange={changeHandler} type="text" name='price' placeholder='Type here...' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
            </div>
            <div className='mb-3'>
                <h4 className='bold-18 pb-2'>Stock:</h4>
                <input value={productDetails.stock} onChange={changeHandler} type="text" name='stock' placeholder='Type here...' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
            </div>
            <div className='mb-3'>
                <h4 className='bold-18 pb-2'>Description:</h4>
                <input value={productDetails.description} onChange={changeHandler} type="text" name='description' placeholder='Type here...' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
            </div>
            <div className="mb-3 flex items-center gap-x-4">
                <h4>Shop:</h4>
                <select value={productDetails.shop_id} onChange={changeHandler} name="shop_id" id="" className='bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none'>
                    <option value="10">Shop 1</option>
                    <option value="11">Shop 2</option>
                    <option value="12">Shop 3</option>
                    <option value="13">Shop 4</option>
                </select>
            </div>
            <div className="mb-3 flex items-center gap-x-4">
                <h4>Product Category:</h4>
                <select value={productDetails.category} onChange={changeHandler} name="category" id="" className='bg-primary ring-1 ring-slate-900/20 medium-16 rounded-sm outline-none'>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kid">Kid</option>
                </select>
            </div>
            <div>
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className="w-20 rounded-sm inline-block" />
                </label>
                <input onChange={imageHandler} type="file" name="images" id="file-input" hidden className="bg-primary max-w-80 w-full py-3 px-4" />
            </div>
            <button onClick={(e) => { e.preventDefault(); Add_Product();} } className='btn_dark_rounded mt-4 flexCenter gap-x-1'><MdAdd />Add product</button>
        </div>
    )
}

export default AddProduct