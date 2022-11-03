INSERT INTO department (name)
VALUES  ('Front End'),
        ('Back End'),
        ('Fullstack');

INSERT INTO roles (title, salary, department_id)
VALUES  ('Database', 80000.00, (SELECT id FROM department WHERE name = 'Back End')),
        ('UI / UX', 70000.00, (SELECT id FROM department WHERE name = 'Front End')),
        ('Server', 120000.00, (SELECT id FROM department WHERE name = 'Back End')),
        ('E-Commerce', 100000.00, (SELECT id FROM department WHERE name = 'Fullstack'));

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('People', 'Manager', (SELECT id FROM roles WHERE title = 'Server'), null),
        ('Foo', 'Bar', (SELECT id FROM roles WHERE title = 'Server'), 1),
        ('John', 'Dough', (SELECT id FROM roles WHERE title = 'Server'), 1),
        ('Money', 'Bags', (SELECT id FROM roles WHERE title = 'E-Commerce'), null),
        ('Jane', 'Foe', (SELECT id FROM roles WHERE title = 'Database'), null);