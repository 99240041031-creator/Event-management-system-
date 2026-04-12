package com.eventmanager.repository;

import com.eventmanager.model.ClubPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubPostRepository extends JpaRepository<ClubPost, String> {
    List<ClubPost> findByClubIdOrderByCreatedAtDesc(String clubId);
}
