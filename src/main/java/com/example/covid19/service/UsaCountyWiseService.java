package com.example.covid19.service;

import com.example.covid19.entity.UsaCountyWise;
import com.example.covid19.repository.UsaCountyWiseRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class UsaCountyWiseService {

    private final UsaCountyWiseRepository repository;

    public UsaCountyWiseService(UsaCountyWiseRepository repository) {
        this.repository = repository;
    }

    public Page<UsaCountyWise> getPaginated(int page, int size, String sortBy, String sortDir, String keyword) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword != null && !keyword.isBlank()) {
            return repository.findByAdmin2ContainingIgnoreCaseOrProvinceStateContainingIgnoreCaseOrCountryRegionContainingIgnoreCaseOrCombinedKeyContainingIgnoreCase(
                    keyword, keyword, keyword, keyword, pageable
            );
        }

        return repository.findAll(pageable);
    }

    public UsaCountyWise getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("USA County record not found: " + id));
    }

    public UsaCountyWise save(UsaCountyWise data) {
        return repository.save(data);
    }

    public UsaCountyWise update(Long id, UsaCountyWise updated) {
        UsaCountyWise existing = getById(id);

        existing.setUid(updated.getUid());
        existing.setIso2(updated.getIso2());
        existing.setIso3(updated.getIso3());
        existing.setCode3(updated.getCode3());
        existing.setFips(updated.getFips());
        existing.setAdmin2(updated.getAdmin2());
        existing.setProvinceState(updated.getProvinceState());
        existing.setCountryRegion(updated.getCountryRegion());
        existing.setLat(updated.getLat());
        existing.setLongValue(updated.getLongValue());
        existing.setCombinedKey(updated.getCombinedKey());
        existing.setDate(updated.getDate());
        existing.setConfirmed(updated.getConfirmed());
        existing.setDeaths(updated.getDeaths());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
