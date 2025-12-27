package com.example.covid19.spec;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class SearchSpecification<T> implements Specification<T> {

    private final String field;
    private final String value;

    public SearchSpecification(String field, String value) {
        this.field = field;
        this.value = value;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        try {
            if (root.get(field).getJavaType() == String.class) {
                return builder.like(builder.lower(root.get(field)), "%" + value.toLowerCase() + "%");
            } else {
                return builder.equal(root.get(field), value);
            }
        } catch (IllegalArgumentException e) {
            return builder.conjunction(); // ignore fields not in entity
        }
    }
}
