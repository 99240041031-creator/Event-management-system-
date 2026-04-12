package com.eventmanager.repository;

import com.eventmanager.model.ApprovalRequest;
import com.eventmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalRequestRepository extends JpaRepository<ApprovalRequest, String> {
    List<ApprovalRequest> findByHod(User hod);
    List<ApprovalRequest> findByHodAndStatus(User hod, ApprovalRequest.RequestStatus status);
}
