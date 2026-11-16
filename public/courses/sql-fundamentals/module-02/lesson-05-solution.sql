SELECT e.name, d.name
FROM employees e
JOIN departments d ON e.department_id = d.id
ORDER BY e.id;
