package com.example.covid19.repository;

import com.example.covid19.entity.CountryWiseLatest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryWiseLatestRepository extends JpaRepository<CountryWiseLatest, Long> {

    Page<CountryWiseLatest> findByCountryRegionContainingIgnoreCaseOrWhoRegionContainingIgnoreCase(
            String country, String region, Pageable pageable);
}
