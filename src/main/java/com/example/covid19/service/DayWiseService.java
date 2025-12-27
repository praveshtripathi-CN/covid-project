package com.example.covid19.service;

import com.example.covid19.entity.DayWise;
import com.example.covid19.repository.DayWiseRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class DayWiseService {

    private final DayWiseRepository repository;

    public DayWiseService(DayWiseRepository repository) {
        this.repository = repository;
    }

    // Pagination + Sorting + Filtering
    public Page<DayWise> getPaginated(int page, int size, String sortBy, String sortDir, String keyword) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword != null && !keyword.isBlank()) {
            return repository.findByDateContainingIgnoreCase(keyword, pageable);
        }

        return repository.findAll(pageable);
    }

    public DayWise getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("DayWise record not found: " + id));
    }

    public DayWise save(DayWise data) {
        return repository.save(data);
    }

    public DayWise update(Long id, DayWise updated) {
        DayWise existing = getById(id);

        existing.setDate(updated.getDate());
        existing.setConfirmed(updated.getConfirmed());
        existing.setDeaths(updated.getDeaths());
        existing.setRecovered(updated.getRecovered());
        existing.setActive(updated.getActive());
        existing.setNewCases(updated.getNewCases());
        existing.setNewDeaths(updated.getNewDeaths());
        existing.setNewRecovered(updated.getNewRecovered());
        existing.setDeathsPer100Cases(updated.getDeathsPer100Cases());
        existing.setRecoveredPer100Cases(updated.getRecoveredPer100Cases());
        existing.setDeathsPer100Recovered(updated.getDeathsPer100Recovered());
        existing.setNoOfCountries(updated.getNoOfCountries());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
