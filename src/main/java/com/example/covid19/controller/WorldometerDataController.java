package com.example.covid19.controller;

import com.example.covid19.entity.WorldometerData;
import com.example.covid19.service.WorldometerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worldometer")
public class WorldometerDataController {

    @Autowired
    private WorldometerService service;

    // Get All Data (No Pagination)
    @GetMapping("/all")
    public List<WorldometerData> getAll() {
        return service.getAll();
    }

    // Get By ID
    @GetMapping("/{id}")
    public WorldometerData getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Create New Record
    @PostMapping
    public WorldometerData create(@RequestBody WorldometerData data) {
        return service.save(data);
    }

    // Update Record
    @PutMapping("/{id}")
    public WorldometerData update(
            @PathVariable Long id,
            @RequestBody WorldometerData updated) {
        return service.update(id, updated);
    }

    // Pagination + Sorting + Filter
    @GetMapping("/page")
    public Page<WorldometerData> getPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String country) {

        return service.getPaginated(page, size, sortBy, sortDir, country);
    }
}
