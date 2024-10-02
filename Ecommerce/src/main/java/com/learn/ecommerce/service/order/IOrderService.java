package com.learn.ecommerce.service.order;

import com.learn.ecommerce.dto.OrderDto;
import com.learn.ecommerce.model.Order;

import java.util.List;

public interface IOrderService {
    Order placeOrder(Long userId);

    OrderDto getOrder(Long orderId);

    List<OrderDto> getUserOrders(Long userId);
}
