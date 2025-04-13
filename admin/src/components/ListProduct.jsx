import React, { useEffect, useState } from 'react'
import {TbTrash} from 'react-icons/tb'
const ListProduct = () => {
    const [allProducts, setAllproducts] = useState([]);
    
    const fetchInfo = async () => {
        await fetch('http://localhost:4000/get-allproducts').then((res) => res.json()).then((data) => {setAllproducts(data)});
    }
    
    useEffect(() => {
        fetchInfo();
    }, [])
    
    const remove_product = async (id) => {
        await fetch('http://localhost:4000/deleteproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:id})
        })
        await fetchInfo();
    }
    return (
        <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-4 sm:p-4 sm:m-7'>
            <h4 className='bold-22 p-5 uppercase'>Product List</h4>
            <div className='max-h-[77vh] overflow-auto px-4 text-center'>
                <table className='w-full mx-auto'>
                    <thead>
                        <tr>
                            <th className='bg-primary bold-14 sm:regular-22 text-star py-12'>Products</th>
                            <th className='p-2'>Title</th>
                            <th className='p-2'>Description</th>
                            <th className='p-2'>Price</th>
                            <th className='p-2'>Stock</th>
                            <th className='p-2'>Category</th>
                            <th className='p-2'>Shop ID</th>
                            <th className='p-2'>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProducts.map((product, i) => (
                            <tr key={i} className='border-b border-slate-900/20 text-gray-20 p-6 medium-14'>
                                <td className='flexStart sm:flexCenter'>
                                    <img src={product.images} alt="" height={43} width={43} className='rounded-lg ring-1 ring-slate-900/5 my-1'/>
                                </td>
                                <td><div className='line-clamp-3'>{product.name}</div></td>
                                <td>{product.description}</td>
                                <td>${product.price}</td>
                                <td>{product.stock}</td>
                                <td>{product.category}</td>
                                <td>{product.shop_id}</td>
                                <td><div className='bold-22 pl-6 sm:pl-14'><TbTrash onClick={() => remove_product(product.id)}/></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListProduct