# SELECT basics

A database stores data in **tables**. A table has columns (the fields) and rows (the records).
`SELECT` asks the database for columns from a table:

```sql
SELECT name, salary FROM employees;
```

Use `*` to get every column. In this course you work with two tables:
`employees` (id, name, department_id, salary) and `departments` (id, name).
