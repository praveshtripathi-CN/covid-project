package com.example.covid19.controller;

import com.example.covid19.entity.DayWise;
import com.example.covid19.service.DayWiseService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/daywise")
public class DayWiseController {

    private final DayWiseService service;

    public DayWiseController(DayWiseService service) {
        this.service = service;
    }

    @GetMapping("/page")
    public Page<DayWise> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String keyword
    ) {
        return service.getPaginated(page, size, sortBy, sortDir, keyword);
    }

    @GetMapping("/{id}")
    public DayWise getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public DayWise create(@RequestBody DayWise data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    public DayWise update(@PathVariable Long id, @RequestBody DayWise data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted ID: " + id;
    }
}
