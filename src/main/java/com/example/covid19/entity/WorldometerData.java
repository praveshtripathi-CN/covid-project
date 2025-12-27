package com.example.covid19.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "worldometer_data")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorldometerData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country_region")
    private String countryRegion;

    private String continent;
    private Long population;

    @Column(name = "total_cases")
    private Long totalCases;

    @Column(name = "new_cases")
    private Long newCases;

    @Column(name = "total_deaths")
    private Long totalDeaths;

    @Column(name = "new_deaths")
    private Long newDeaths;

    @Column(name = "total_recovered")
    private Long totalRecovered;

    @Column(name = "new_recovered")
    private Long newRecovered;

    @Column(name = "active_cases")
    private Long activeCases;

    @Column(name = "serious_critical")
    private Long seriousCritical;

    @Column(name = "cases_per_million")
    private Double casesPerMillion;

    @Column(name = "deaths_per_million")
    private Double deathsPerMillion;

    @Column(name = "total_tests")
    private Long totalTests;

    @Column(name = "tests_per_million")
    private Double testsPerMillion;

    @Column(name = "who_region")
    private String whoRegion;
}
