package com.example.covid19.controller;

import com.example.covid19.entity.Covid19CleanComplete;
import com.example.covid19.service.Covid19CleanCompleteService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clean-complete")
public class Covid19CleanCompleteController {

    private final Covid19CleanCompleteService service;

    public Covid19CleanCompleteController(Covid19CleanCompleteService service) {
        this.service = service;
    }

    // Pagination + Sorting + Search
    @GetMapping("/page")
    public Page<Covid19CleanComplete> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String keyword
    ) {
        return service.getPaginated(page, size, sortBy, sortDir, keyword);
    }

    @GetMapping("/{id}")
    public Covid19CleanComplete getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Covid19CleanComplete create(@RequestBody Covid19CleanComplete data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    public Covid19CleanComplete update(@PathVariable Long id, @RequestBody Covid19CleanComplete data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted CleanComplete record ID: " + id;
    }
}
