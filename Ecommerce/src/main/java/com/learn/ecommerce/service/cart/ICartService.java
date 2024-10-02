package com.learn.ecommerce.service.cart;

import com.learn.ecommerce.model.Cart;
import com.learn.ecommerce.model.User;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long id);

    void clearCart(Long id);

    BigDecimal getTotalPrice(Long id);

    Cart initializeNewCart(User user);

    Cart getCartByUserId(Long userId);
}
