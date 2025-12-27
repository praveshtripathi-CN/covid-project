package com.example.covid19.repository;

import com.example.covid19.entity.FullGrouped;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FullGroupedRepository extends JpaRepository<FullGrouped, Long> {

    Page<FullGrouped> findByCountryRegionContainingIgnoreCaseOrWhoRegionContainingIgnoreCase(
            String country,
            String region,
            Pageable pageable
    );
}
