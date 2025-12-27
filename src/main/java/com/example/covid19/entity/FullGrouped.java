package com.example.covid19.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "full_grouped")
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FullGrouped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;

    @Column(name = "country_region")
    private String countryRegion;

    private Long confirmed;
    private Long deaths;
    private Long recovered;
    private Long active;

    @Column(name = "new_cases")
    private Long newCases;

    @Column(name = "new_deaths")
    private Long newDeaths;

    @Column(name = "new_recovered")
    private Long newRecovered;

    @Column(name = "who_region")
    private String whoRegion;
}

