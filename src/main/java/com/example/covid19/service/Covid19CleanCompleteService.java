package com.example.covid19.service;

import com.example.covid19.entity.Covid19CleanComplete;
import com.example.covid19.repository.Covid19CleanCompleteRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class Covid19CleanCompleteService {

    private final Covid19CleanCompleteRepository repository;

    public Covid19CleanCompleteService(Covid19CleanCompleteRepository repository) {
        this.repository = repository;
    }

    // Pagination + Sorting + Search
    public Page<Covid19CleanComplete> getPaginated(int page, int size, String sortBy, String sortDir, String keyword) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword != null && !keyword.isBlank()) {
            return repository.findByCountryRegionContainingIgnoreCaseOrProvinceStateContainingIgnoreCase(
                    keyword, keyword, pageable
            );
        }

        return repository.findAll(pageable);
    }

    public Covid19CleanComplete getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found: " + id));
    }

    public Covid19CleanComplete save(Covid19CleanComplete data) {
        return repository.save(data);
    }

    public Covid19CleanComplete update(Long id, Covid19CleanComplete updated) {
        Covid19CleanComplete existing = getById(id);

        existing.setProvinceState(updated.getProvinceState());
        existing.setCountryRegion(updated.getCountryRegion());
        existing.setLat(updated.getLat());
        existing.setLongValue(updated.getLongValue());
        existing.setDate(updated.getDate());
        existing.setConfirmed(updated.getConfirmed());
        existing.setDeaths(updated.getDeaths());
        existing.setRecovered(updated.getRecovered());
        existing.setActive(updated.getActive());
        existing.setWhoRegion(updated.getWhoRegion());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
