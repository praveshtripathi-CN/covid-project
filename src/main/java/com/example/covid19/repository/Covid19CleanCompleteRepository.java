package com.example.covid19.repository;

import com.example.covid19.entity.Covid19CleanComplete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Covid19CleanCompleteRepository extends JpaRepository<Covid19CleanComplete, Long> {

    Page<Covid19CleanComplete> findByCountryRegionContainingIgnoreCaseOrProvinceStateContainingIgnoreCase(
            String country, String state, Pageable pageable);
}
