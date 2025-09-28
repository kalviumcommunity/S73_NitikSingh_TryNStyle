import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on initial render
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Calculate cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
    }, [cart]);

    const addToCart = (product, quantity = 1, size) => {
        setCart(currentCart => {
            const existingItemIndex = currentCart.findIndex(
                item => item._id === product._id && item.size === size
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                const newCart = [...currentCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                // Add new item
                return [...currentCart, { ...product, quantity, size }];
            }
        });
    };

    const removeFromCart = (productId, size) => {
        setCart(currentCart => 
            currentCart.filter(item => !(item._id === productId && item.size === size))
        );
    };

    const updateQuantity = (productId, size, quantity) => {
        if (quantity < 1) return;
        
        setCart(currentCart => 
            currentCart.map(item => 
                item._id === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;