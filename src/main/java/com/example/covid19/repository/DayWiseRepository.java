package com.example.covid19.repository;

import com.example.covid19.entity.DayWise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayWiseRepository extends JpaRepository<DayWise, Long> {

    // Search on multiple fields (date OR country count)
    Page<DayWise> findByDateContainingIgnoreCase(String keyword, Pageable pageable);
}
