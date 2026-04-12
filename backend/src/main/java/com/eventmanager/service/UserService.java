package com.eventmanager.service;

import com.eventmanager.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User getUserByEmail(String email);
    User getUserById(String id);
    List<User> getAllUsers();
    User createUser(User user);
    User updateUser(String id, User user);
    void deleteUser(String id);
}
