import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import classicTeeImage from './classic-tee.jpg';

function App() {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product');
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, []);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }

    const cartItem = {
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: classicTeeImage,
    };

    const existingItem = cart.find((item) => item.size === selectedSize);
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.size === selectedSize ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...cartItem, quantity: 1 }]);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="container">
      <header className="header">
        <button className="cart-button" onClick={toggleCart}>
          Cart ({getTotalItems()})
        </button>
        {isCartOpen && (
          <div className="cart">
            <h3>Cart</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <ul>
                  {cart.map((item, index) => (
                    <li key={index}>
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      {item.name} ({item.size}) - ${item.price} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </>
            )}
          </div>
        )}
      </header>
      {product ? (
        <div className="product-details">
          <div className="image-container">
            <img src={classicTeeImage} alt="Classic Tee" />
          </div>
          <div className="details-container">
            <h2>Classic Tee</h2>
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="description">{product.description}</p>
            <div className="size-selector">
              <span>SIZE<span className="required-star">*</span></span>
              <div>
                <button
                  className={`size-btn ${selectedSize === 'S' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('S')}
                >
                  S
                </button>
                <button
                  className={`size-btn ${selectedSize === 'M' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('M')}
                >
                  M
                </button>
                <button
                  className={`size-btn ${selectedSize === 'L' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('L')}
                >
                  L
                </button>
              </div>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;