package com.example.covid19.spec;

import org.springframework.data.jpa.domain.Specification;
import java.util.List;

public class SpecificationBuilder<T> {

    public Specification<T> build(String keyword, List<String> fields) {
        if (keyword == null || keyword.isEmpty()) return null;

        Specification<T> spec = null;

        for (String field : fields) {
            Specification<T> temp = (root, query, builder) ->
                    new SearchSpecification<T>(field, keyword)
                            .toPredicate(root, query, builder);

            spec = (spec == null) ? temp : spec.or(temp);
        }

        return spec;
    }
}
