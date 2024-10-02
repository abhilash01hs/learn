package com.learn.ecommerce.service.user;

import com.learn.ecommerce.dto.UserDto;
import com.learn.ecommerce.exception.AlreadyExistsException;
import com.learn.ecommerce.exception.ResourceNotFoundException;
import com.learn.ecommerce.model.User;
import com.learn.ecommerce.repository.UserRepository;
import com.learn.ecommerce.request.CreateUserRequest;
import com.learn.ecommerce.request.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;

    private final ModelMapper modelMapper;

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User createUser(CreateUserRequest request) {
        // TODO Auto-generated method stub
        return Optional.of(request).filter(user -> !userRepository.existsByEmail(request.getEmail())).map(data -> {
            User user = new User();
            user.setEmail(data.getEmail());
            user.setPassword(data.getPassword());
            user.setFirstName(data.getFirstName());
            user.setLastName(data.getLastName());
            return userRepository.save(user);
        }).orElseThrow(() -> new AlreadyExistsException("Nah! " + request.getEmail() + " already exists"));
    }

    @Override
    public User updateUser(UpdateUserRequest request, Long userId) {
        userRepository.findById(userId).map(existinguser -> {
            existinguser.setFirstName(request.getFirstName());
            existinguser.setLastName(request.getLastName());
            return userRepository.save(existinguser);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return null;
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.findById(userId).ifPresentOrElse(userRepository::delete, () -> {
            throw new ResourceNotFoundException("User not found");
        });
    }

    @Override
    public UserDto convertToDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
