import { useState, useEffect } from "react";
import axios from "axios";

import AOS from "aos";
import "aos/dist/aos.css";

import emptyCart from "/assets/images/illustration-empty-cart.svg";
import cartIcon from "/assets/images/icon-add-to-cart.svg";
import carbonIcon from "/assets/images/icon-carbon-neutral.svg";

import "./App.css";
import OrderConfirmed from "./components/OrderConfirmed";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 500,
    });
  }, []);

  const screenWidth = () => {
    if (screen.width > 1200) {
      return "desktop";
    } else if (screen.width > 800) {
      return "tablet";
    } else {
      return "mobile";
    }
  };

  let screenType = screenWidth();

  const [products, setProducts] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [confirmPanel, setConfirmPanel] = useState(false);

  const getProducts = async () => {
    try {
      const response = await axios.get("./data.json");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    screenWidth();
  }, [screen.width]);

  useEffect(() => {
    if (confirmPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [confirmPanel]);

  const addToCart = (product) => {
    let alreadySelected = selectedProducts.some(
      (selection) => selection.itemName === product.name
    );

    if (alreadySelected) {
      setSelectedProducts((prevSelections) =>
        prevSelections.map((selection) => {
          if (selection.itemName === product.name) {
            return { ...selection, count: selection.count + 1 };
          } else {
            return selection;
          }
        })
      );

      return;
    }

    setSelectedProducts((prevSelections) => [
      ...prevSelections,
      {
        itemName: product.name,
        thumbnail: product.image.thumbnail,
        price: product.price,
        count: 1,
      },
    ]);
  };

  const removeItem = (product) => {
    const checkCount = selectedProducts.find(
      (selection) => selection.itemName === product.name
    );

    if (checkCount.count > 1) {
      const updatedSelections = selectedProducts.map((selection) => {
        if (selection.itemName === product.name) {
          return { ...selection, count: selection.count - 1 };
        } else {
          return selection;
        }
      });
      setSelectedProducts(updatedSelections);
    } else {
      const editedSelections = selectedProducts.filter(
        (selection) => selection.itemName !== product.name
      );
      setSelectedProducts(editedSelections);
    }
  };

  const deleteItem = (product) => {
    const editedSelections = selectedProducts.filter(
      (selection) => selection.itemName !== product.itemName
    );
    setSelectedProducts(editedSelections);
  };

  const totalItems = () => {
    let counter = 0;

    for (let i = 0; i < selectedProducts.length; i++) {
      counter += selectedProducts[i].count;
    }

    return counter;
  };
  const totaled = totalItems();

  const calcPrice = () => {
    let priceArr = [];

    for (let i = 0; i < selectedProducts.length; i++) {
      priceArr.push(selectedProducts[i].price * selectedProducts[i].count);
    }

    console.log(priceArr);
    if (selectedProducts.length > 1) {
      let total = priceArr.reduce((prev, curr) => prev + curr);
      return total;
    } else {
      return priceArr[0];
    }
  };
  const totalPrice = calcPrice();

  const newOrder = () => {
    setSelectedProducts([]);
    setConfirmPanel(false);
  };

  console.log(totalPrice);

  return (
    <>
      {confirmPanel && (
        <OrderConfirmed
          selectedProducts={selectedProducts}
          totalPrice={totalPrice}
          newOrder={newOrder}
        />
      )}

      <main className={screenType !== "mobile" ? "main" : "mobile_main"}>
        <section className="product_section">
          <h1>Desserts</h1>

          <div className="products_grid">
            {products &&
              products.map((product) => {
                screenType;
                const imageUrl = product.image[screenType];
                const matchedProduct = selectedProducts.find(
                  (item) => item.itemName === product.name
                );

                return (
                  <div key={product.name} className="product_container">
                    <img
                      aria-label={`Image of ${product.name}`}
                      src={imageUrl}
                      className={
                        matchedProduct
                          ? "product_image_selected"
                          : "product_image"
                      }
                      alt={`${product.name}`}
                    />

                    <div className="cart_button_container">
                      {!matchedProduct && (
                        <div
                          className="default_add"
                          role="button"
                          aria-label="Add to cart"
                          onClick={() => addToCart(product)}
                        >
                          <img src={cartIcon} alt="Cart" aria-label="" />
                          <p>Add to cart</p>
                        </div>
                      )}

                      {matchedProduct && (
                        <div className="added_product">
                          <button
                            type="button"
                            aria-label="Remove Item"
                            className="quantity_button"
                            onClick={() => removeItem(product)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 10 2"
                            >
                              <path d="M0 .375h10v1.25H0V.375Z" />
                            </svg>
                          </button>

                          <p className="product_count">
                            {matchedProduct.count}
                          </p>

                          <button
                            type="button"
                            aria-label="Add Item"
                            className="quantity_button"
                            onClick={() => addToCart(product)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 10 10"
                            >
                              <path d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="card">
                      <p className="product_category">{product.category}</p>
                      <p className="product_name">{product.name}</p>
                      <p className="product_price">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        <section className="cart_section">
          <h2>Your Cart ({totaled ? `${totaled}` : `0`})</h2>

          {selectedProducts.length === 0 ? (
            <div className={selectedProducts.length === 0 ? "empty_cart" : ""}>
              <img
                src={selectedProducts.length === 0 ? emptyCart : ""}
                aria-label="Empty Cart"
                alt="Empty Cart"
              />

              {selectedProducts.length === 0 && (
                <p className="empty_text">Your added items will appear hear</p>
              )}
            </div>
          ) : (
            <div className="cart_items_container">
              {selectedProducts.map((selected, index) => (
                <div key={index} className="cart_item">
                  <div className="cart_item_info">
                    <p>{selected.itemName}</p>

                    <div className="cart_item_price">
                      <p>{selected.count}x</p>
                      <p>@${selected.price.toFixed(2)}</p>
                      <p>${(selected.price * selected.count).toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      aria-label="Remove Item"
                      className="remove_item_from_cart"
                      onClick={() => deleteItem(selected)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 10 10"
                      >
                        <path d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="order_total">
                <p>Order Total</p>
                <h3>${totalPrice.toFixed(2)}</h3>
              </div>

              <div className="carbon_alert">
                <img src={carbonIcon} aria-label="" alt="Carbon-Neutral" />
                <p>
                  This is a{" "}
                  <strong style={{ fontWeight: "500" }}>carbon-neutral</strong>{" "}
                  delivery
                </p>
              </div>

              <button
                type="button"
                className="confirm_order_button"
                onClick={() => setConfirmPanel(true)}
              >
                Confirm Order
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default App;
