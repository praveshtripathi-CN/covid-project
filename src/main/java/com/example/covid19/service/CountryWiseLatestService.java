package com.example.covid19.service;

import com.example.covid19.entity.CountryWiseLatest;
import com.example.covid19.repository.CountryWiseLatestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class CountryWiseLatestService {

    @Autowired
    private CountryWiseLatestRepository repository;

    public Page<CountryWiseLatest> getPaginated(int page, int size, String sortBy, String sortDir, String keyword) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword != null && !keyword.isBlank()) {
            return repository.findByCountryRegionContainingIgnoreCaseOrWhoRegionContainingIgnoreCase(
                    keyword, keyword, pageable
            );
        }

        return repository.findAll(pageable);
    }

    public CountryWiseLatest getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));
    }

    public CountryWiseLatest save(CountryWiseLatest data) {
        return repository.save(data);
    }

    public CountryWiseLatest update(Long id, CountryWiseLatest newData) {
        CountryWiseLatest existing = getById(id);

        existing.setCountryRegion(newData.getCountryRegion());
        existing.setConfirmed(newData.getConfirmed());
        existing.setDeaths(newData.getDeaths());
        existing.setRecovered(newData.getRecovered());
        existing.setActive(newData.getActive());
        existing.setNewCases(newData.getNewCases());
        existing.setNewDeaths(newData.getNewDeaths());
        existing.setNewRecovered(newData.getNewRecovered());
        existing.setWhoRegion(newData.getWhoRegion());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
