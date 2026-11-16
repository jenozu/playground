# Sorting with ORDER BY

Rows come back in no guaranteed order. `ORDER BY` sorts them; add `DESC` for highest first:

```sql
SELECT name, salary FROM employees ORDER BY salary DESC;
```

## Your turn

List each employee's `name` and `salary`, highest salary first.
