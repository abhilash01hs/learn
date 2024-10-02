package com.learn.ecommerce.service.user;

import com.learn.ecommerce.dto.UserDto;
import com.learn.ecommerce.model.User;
import com.learn.ecommerce.request.CreateUserRequest;
import com.learn.ecommerce.request.UpdateUserRequest;

public interface IUserService {
    User getUserById(Long userId);

    User createUser(CreateUserRequest request);

    User updateUser(UpdateUserRequest request, Long userId);

    void deleteUser(Long userId);

    UserDto convertToDto(User user);
}
