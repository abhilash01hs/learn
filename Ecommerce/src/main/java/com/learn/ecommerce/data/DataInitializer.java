package com.learn.ecommerce.data;

import com.learn.ecommerce.model.User;
import com.learn.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {
    private final UserRepository userRepository;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        createDefaultUserIfNotExists();
    }

    private void createDefaultUserIfNotExists() {
        for (int i = 0; i <= 5; i++) {
            String email = "user" + i + "@email.com";
            if (userRepository.existsByEmail(email)) {
                continue;
            }
            User user = new User();
            user.setFirstName("User" + i);
            user.setLastName("lName" + i);
            user.setEmail(email);
            user.setPassword("123");
            userRepository.save(user);
            System.out.println("User " + i +" created");
        }
    }
}
