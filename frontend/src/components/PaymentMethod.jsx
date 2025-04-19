import PropTypes from 'prop-types';

export default function PaymentMethod({ selected, onChange }) {
    return (
        <section className="my-6 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>

            <label className="inline-flex items-center mr-4">
                <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={selected === 'cod'}
                    onChange={onChange}
                    className="mr-2"
                />
                COD (Thanh toán khi nhận hàng)
            </label>

            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={selected === 'paypal'}
                    onChange={onChange}
                    className="ml-4 mr-2"
                />
                PayPal
            </label>
        </section>
    );
}

PaymentMethod.propTypes = {
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
