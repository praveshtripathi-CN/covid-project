package com.example.covid19.controller;

import com.example.covid19.entity.FullGrouped;
import com.example.covid19.service.FullGroupedService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/full-grouped")
public class FullGroupedController {

    private final FullGroupedService service;

    public FullGroupedController(FullGroupedService service) {
        this.service = service;
    }

    @GetMapping("/page")
    public Page<FullGrouped> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String keyword
    ) {
        return service.getPaginated(page, size, sortBy, sortDir, keyword);
    }

    @GetMapping("/{id}")
    public FullGrouped getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public FullGrouped create(@RequestBody FullGrouped data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    public FullGrouped update(@PathVariable Long id, @RequestBody FullGrouped data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted ID: " + id;
    }
}
