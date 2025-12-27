package com.example.covid19.service;

import com.example.covid19.entity.FullGrouped;
import com.example.covid19.repository.FullGroupedRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class FullGroupedService {

    private final FullGroupedRepository repository;

    public FullGroupedService(FullGroupedRepository repository) {
        this.repository = repository;
    }

    public Page<FullGrouped> getPaginated(int page, int size, String sortBy, String sortDir, String keyword) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword != null && !keyword.isBlank()) {
            return repository.findByCountryRegionContainingIgnoreCaseOrWhoRegionContainingIgnoreCase(
                    keyword,
                    keyword,
                    pageable
            );
        }

        return repository.findAll(pageable);
    }

    public FullGrouped getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    public FullGrouped save(FullGrouped data) {
        return repository.save(data);
    }

    public FullGrouped update(Long id, FullGrouped updated) {
        FullGrouped existing = getById(id);

        existing.setDate(updated.getDate());
        existing.setCountryRegion(updated.getCountryRegion());
        existing.setConfirmed(updated.getConfirmed());
        existing.setDeaths(updated.getDeaths());
        existing.setRecovered(updated.getRecovered());
        existing.setActive(updated.getActive());
        existing.setNewCases(updated.getNewCases());
        existing.setNewDeaths(updated.getNewDeaths());
        existing.setNewRecovered(updated.getNewRecovered());
        existing.setWhoRegion(updated.getWhoRegion());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
