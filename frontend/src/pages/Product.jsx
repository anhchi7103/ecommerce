import { useContext } from 'react'
import {ShopContext} from "../Context/ShopContext"
import { useParams } from "react-router-dom"
import ProductHd from '../components/ProductHd';
import ProductDisplay from '../components/ProductDisplay';
import ShopInfo from '../components/ShopInfo';
import ProductSuggestion from '../components/ProductSuggestion';

const Product = () => {
  const {all_products} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_products.find((e) => e._id === Number(productId));
  if (!product){
    return <div>  Product not found! </div>
  }

  return (
    <section className='max_padd_container py-28'>
      <div>
        <ProductHd product={product}/>
        <ProductDisplay product={product}/>
        <ShopInfo product={product}/>
        <ProductSuggestion suggested_products={all_products}/>
      </div>
    </section>
  )
}

export default Product