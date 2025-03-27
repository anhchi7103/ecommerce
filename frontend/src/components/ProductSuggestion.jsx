import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from '../components/Item'

const ProductSuggestions = ({ suggested_products }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 2, 
    nextArrow: <button className="slick-next">→</button>,
    prevArrow: <button className="slick-prev">←</button>,
  };

  return (
    <div className="my-4 mx-2">
      <h5 className="font-bold mb-4">Products you may like</h5>
        <Slider {...settings}>
            {suggested_products.map((item) => (
                <div className="px-2 mx-2 flex justify-center">
                    <Item
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    old_price={item.old_price}
                    new_price={item.new_price}
                    />
                </div>
            ))}
        </Slider>
    </div>
  );
};

export default ProductSuggestions;
