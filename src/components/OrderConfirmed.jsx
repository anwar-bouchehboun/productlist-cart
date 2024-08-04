import PropTypes from 'prop-types';


import checkIcon from '/assets/images/icon-order-confirmed.svg';

import orderConfirmed from './OrderConfirmed.module.css'

const OrderConfirmed = ({ selectedProducts, totalPrice, newOrder }) => {

    console.log(selectedProducts)

    return (
        <section className={orderConfirmed.order_confirmed_section}>

        <div data-aos="fade-down" className={orderConfirmed.confirm_panel}>

            <img aria-label="" placeholder="" src={checkIcon}/>

            <>
            <h3>Order Confirmed</h3>
            <p>We hope you enjoy your food!</p>
            </>

            <div className={orderConfirmed.confirmed_preview}>

                {selectedProducts.map((selected, index) => (

                        <div key={index} className={orderConfirmed.cart_item}>
                            <div>
                                <div>
                                    <img src={selected.thumbnail} alt={`${selected.name}`} aria-label="" className={orderConfirmed.cart_image}/>
                                </div>

                                <div className={orderConfirmed.cart_item_info}>
                                    <p>{selected.itemName}</p>

                                    <div className={orderConfirmed.cart_item_price}>
                                        <p>{selected.count}x</p>
                                        <p>@${(selected.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>


                            <p className={orderConfirmed.total_items_price}>${(selected.price * selected.count).toFixed(2)}</p>
                        </div>

                    )
                )}

                <div className={orderConfirmed.total_price}>
                    <p>Order Total</p>
                    <p>${(totalPrice).toFixed(2)}</p>
                </div>




            </div>

            <button type="button" aria-label='Create new order'
            onClick={newOrder} className={orderConfirmed.new_order}>Start New Order</button>
        </div>

    </section>
    )
}


OrderConfirmed.propTypes = {
        selectedProducts: PropTypes.arrayOf(
            PropTypes.shape({
                itemName: PropTypes.string.isRequired,
                thumbnail: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
                price: PropTypes.number.isRequired,
            })
        ).isRequired,
        totalPrice: PropTypes.number.isRequired,
        newOrder: PropTypes.func.isRequired,
}

export default OrderConfirmed