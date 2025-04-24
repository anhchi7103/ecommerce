import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Item from '../components/Item'

const ProductSuggestions = ({ user_based_suggestions = [], product_based_suggestions = [] }) => {
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button className="slick-next" onClick={onClick}>
        →
      </button>
    );
  };
  
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button className="slick-prev" onClick={onClick}>
        ←
      </button>
    );
  };
  
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5, 
    slidesToScroll: 2, 
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>,
    initialSlide: 0,
    centerMode: false
  };

  
  return (
    <>
      {user_based_suggestions.length > 0 && (
        <div className="my-4 mx-2">
          <h5 className="font-bold mb-4">Products you may like</h5>
          <Slider {...settings}>
            {user_based_suggestions.map((item) => (
              <div
                key={item._id}
                className="px-2 mx-2 w-[180px] sm:w-[200px] md:w-[220px]"
              >
                <Item
                  _id={item._id}
                  images={item.images}
                  name={item.name}
                  price={item.price}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
      {product_based_suggestions.length > 0 && (
        <div className="my-4 mx-2">
          <h5 className="font-bold mb-4">Products with similiar features</h5>
          <Slider {...settings}>
            {product_based_suggestions.map((item) => (
              <div
                key={item._id}
                className="px-2 mx-2 w-[180px] sm:w-[200px] md:w-[220px]"
              >
                <Item
                  _id={item._id}
                  images={item.images}
                  name={item.name}
                  price={item.price}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
};

export default ProductSuggestions;
