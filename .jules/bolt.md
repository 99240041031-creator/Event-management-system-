## 2026-05-12 - [Database-side Filtering Optimization]
**Learning:** Refactoring in-memory filtering (using `findAll().stream().filter(...).count()`) to database-level counting (using JPA repository methods like `countBy...`) significantly improves performance by reducing heap memory usage and network transfer overhead, especially for large datasets.
**Action:** Always prefer JPA Query Methods or @Query for aggregations and filtering rather than fetching all records into the application memory.
