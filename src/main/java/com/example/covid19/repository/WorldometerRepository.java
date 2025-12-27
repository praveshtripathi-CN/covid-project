package com.example.covid19.repository;

import com.example.covid19.entity.WorldometerData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorldometerRepository extends JpaRepository<WorldometerData,Long> {
    Page<WorldometerData> findByCountryRegionContainingIgnoreCase(String country, Pageable pageable);
}
