package com.example.covid19.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usa_county_wise")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsaCountyWise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long uid;
    private String iso2;
    private String iso3;
    private Integer code3;
    private Double fips;

    @Column(name = "admin2")
    private String admin2;

    @Column(name = "province_state")
    private String provinceState;

    @Column(name = "country_region")
    private String countryRegion;

    private Double lat;

    @Column(name = "long_")
    private Double longValue;

    @Column(name = "combined_key")
    private String combinedKey;

    private String date;
    private Integer confirmed;
    private Integer deaths;
}