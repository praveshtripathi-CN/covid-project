package com.example.covid19.service;

import com.example.covid19.entity.WorldometerData;
import com.example.covid19.repository.WorldometerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorldometerService {

    @Autowired
    private WorldometerRepository repository;

    // Get All
    public List<WorldometerData> getAll() {
        return repository.findAll();
    }

    // Get by ID
    public WorldometerData getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found with ID: " + id));
    }

    // Save
    public WorldometerData save(WorldometerData data) {
        return repository.save(data);
    }

    // Update
    public WorldometerData update(Long id, WorldometerData updated) {
        WorldometerData existing = getById(id);

        existing.setCountryRegion(updated.getCountryRegion());
        existing.setContinent(updated.getContinent());
        existing.setPopulation(updated.getPopulation());
        existing.setTotalCases(updated.getTotalCases());
        existing.setNewCases(updated.getNewCases());
        existing.setTotalDeaths(updated.getTotalDeaths());
        existing.setNewDeaths(updated.getNewDeaths());
        existing.setTotalRecovered(updated.getTotalRecovered());
        existing.setNewRecovered(updated.getNewRecovered());
        existing.setActiveCases(updated.getActiveCases());
        existing.setSeriousCritical(updated.getSeriousCritical());
        existing.setCasesPerMillion(updated.getCasesPerMillion());
        existing.setDeathsPerMillion(updated.getDeathsPerMillion());
        existing.setTotalTests(updated.getTotalTests());
        existing.setTestsPerMillion(updated.getTestsPerMillion());
        existing.setWhoRegion(updated.getWhoRegion());

        return repository.save(existing);
    }

    // Pagination + Sorting + Filtering
    public Page<WorldometerData> getPaginated(int page, int size, String sortBy, String sortDir, String country) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (country != null && !country.isBlank()) {
            return repository.findByCountryRegionContainingIgnoreCase(country, pageable);
        }

        return repository.findAll(pageable);
    }
}
