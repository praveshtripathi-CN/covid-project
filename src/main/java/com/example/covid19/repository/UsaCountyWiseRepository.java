package com.example.covid19.repository;

import com.example.covid19.entity.UsaCountyWise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsaCountyWiseRepository extends JpaRepository<UsaCountyWise, Long> {

    Page<UsaCountyWise> findByAdmin2ContainingIgnoreCaseOrProvinceStateContainingIgnoreCaseOrCountryRegionContainingIgnoreCaseOrCombinedKeyContainingIgnoreCase(
            String admin2,
            String province,
            String country,
            String combinedKey,
            Pageable pageable
    );
}
