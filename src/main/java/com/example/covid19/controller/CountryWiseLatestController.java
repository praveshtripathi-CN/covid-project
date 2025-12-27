package com.example.covid19.controller;

import com.example.covid19.entity.CountryWiseLatest;
import com.example.covid19.service.CountryWiseLatestService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/country-latest")
public class CountryWiseLatestController {

    private final CountryWiseLatestService service;

    public CountryWiseLatestController(CountryWiseLatestService service) {
        this.service = service;
    }

    // Pagination + Sorting + Search
    @GetMapping("/page")
    public Page<CountryWiseLatest> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String keyword
    ) {
        return service.getPaginated(page, size, sortBy, sortDir, keyword);
    }

    @GetMapping("/{id}")
    public CountryWiseLatest getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public CountryWiseLatest create(@RequestBody CountryWiseLatest data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    public CountryWiseLatest update(@PathVariable Long id, @RequestBody CountryWiseLatest data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted CountryWiseLatest ID: " + id;
    }
}
