import { useContext, useState, useEffect } from 'react'
import {ShopContext} from "../Context/ShopContext"
import { useParams } from "react-router-dom"
import ProductHd from '../components/ProductHd';
import ProductDisplay from '../components/ProductDisplay';
import ShopInfo from '../components/ShopInfo';
import ProductSuggestion from '../components/ProductSuggestion';

const Product = () => {
  const { all_products, suggestProductsbyUser, fetchSuggestedProductsbyProductId } = useContext(ShopContext);
  const {productId} = useParams();

  const product = all_products.find((e) => e._id === Number(productId));
  if (!product){
    return <div>  Product not found! </div>
  }
  const [suggestProductByProductId, setSuggestProductByProductId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const suggestions = await fetchSuggestedProductsbyProductId(product._id);
      console.log(suggestions)
      setSuggestProductByProductId(suggestions);
    };

    fetchData();
  }, []);

  console.log(suggestProductsbyUser)
  console.log(suggestProductByProductId)

  const filteredSuggestionsByUser = suggestProductsbyUser.filter(item => item._id !== product._id);
  const filteredSuggestionsByProductId = suggestProductByProductId.filter(item => item._id !== product._id);

  return (
    <section className='max_padd_container py-28'>
      <div>
        <ProductHd product={product}/>
        <ProductDisplay product={product}/>
        <ShopInfo product={product}/>
        <ProductSuggestion 
          user_based_suggestions={filteredSuggestionsByUser}
          product_based_suggestions={filteredSuggestionsByProductId}
        />
      </div>
    </section>
  )
}

export default Product