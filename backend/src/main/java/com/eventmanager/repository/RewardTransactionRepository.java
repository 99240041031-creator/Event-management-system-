package com.eventmanager.repository;

import com.eventmanager.model.RewardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, String> {
    List<RewardTransaction> findByAmbassadorId(String ambassadorId);
    List<RewardTransaction> findByAmbassadorIdOrderByAwardedAtDesc(String ambassadorId);
}
