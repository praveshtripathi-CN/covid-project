package com.example.covid19.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "covid_19_clean_complete")
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Covid19CleanComplete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "province_state")
    private String provinceState;

    @Column(name = "country_region")
    private String countryRegion;

    private Double lat;

    @Column(name = "long_")
    private Double longValue;

    private String date;
    private Long confirmed;
    private Long deaths;
    private Long recovered;
    private Long active;

    @Column(name = "who_region")
    private String whoRegion;
}

