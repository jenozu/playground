CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, department_id INTEGER, salary INTEGER NOT NULL);
INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Sales'), (3, 'Support');
INSERT INTO employees VALUES
  (1, 'Alice', 1, 70000), (2, 'Bob', 1, 60000), (3, 'Carol', 2, 80000),
  (4, 'Dan', 2, 55000), (5, 'Eve', 3, 65000), (6, 'Frank', 3, 50000);
