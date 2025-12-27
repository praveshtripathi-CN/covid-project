package com.example.covid19.controller;

import com.example.covid19.entity.UsaCountyWise;
import com.example.covid19.service.UsaCountyWiseService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usa-county")
public class UsaCountyWiseController {

    private final UsaCountyWiseService service;

    public UsaCountyWiseController(UsaCountyWiseService service) {
        this.service = service;
    }

    @GetMapping("/page")
    public Page<UsaCountyWise> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String keyword
    ) {
        return service.getPaginated(page, size, sortBy, sortDir, keyword);
    }

    @GetMapping("/{id}")
    public UsaCountyWise getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public UsaCountyWise create(@RequestBody UsaCountyWise data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    public UsaCountyWise update(@PathVariable Long id, @RequestBody UsaCountyWise data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Deleted USA County ID: " + id;
    }
}
