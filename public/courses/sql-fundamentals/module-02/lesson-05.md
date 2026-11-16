# Combining tables with JOIN

`employees.department_id` points at `departments.id`. A `JOIN` lines rows up by that link:

```sql
SELECT e.name, d.name
FROM employees e
JOIN departments d ON e.department_id = d.id;
```

## Your turn

Return each employee's name and their department name, ordered by employee id.
