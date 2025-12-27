package com.example.covid19.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "day_wise")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DayWise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
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

    @Column(name = "deaths_per_100_cases")
    private Double deathsPer100Cases;

    @Column(name = "recovered_per_100_cases")
    private Double recoveredPer100Cases;

    @Column(name = "deaths_per_100_recovered")
    private Double deathsPer100Recovered;

    @Column(name = "no_of_countries")
    private Integer noOfCountries;
}
