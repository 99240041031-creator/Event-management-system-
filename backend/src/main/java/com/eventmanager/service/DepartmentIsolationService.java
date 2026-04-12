package com.eventmanager.service;

import com.eventmanager.model.User;
import com.eventmanager.security.Roles;
import org.springframework.stereotype.Service;

@Service
public class DepartmentIsolationService {

    public boolean canAccess(User currentUser, String targetDepartmentId) {
        if (Roles.AMBASSADOR.equals(currentUser.getRole()) || Roles.COLLEGE_ADMIN.equals(currentUser.getRole())) {
            return true;
        }

        if (currentUser.getDepartmentEntity() == null) {
            return false;
        }

        return currentUser.getDepartmentEntity().getId().equals(targetDepartmentId);
    }
}
