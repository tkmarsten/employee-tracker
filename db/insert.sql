INSERT INTO department (name)
VALUES  ('goofs'),
        ('gaffs'),
        ('laughs');

INSERT INTO roles (title, salary, department_id)
VALUES  ('memes', 30000.00, (SELECT id FROM department WHERE name = 'laughs')),
        ('pranks', 20000.00, (SELECT id FROM department WHERE name = 'goofs')),
        ('funnies', 40000.00, (SELECT id FROM department WHERE name = 'gaffs'));

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('manager', 'face', (SELECT id FROM roles WHERE title = 'memes'), null),
        ('boo', 'bear', (SELECT id FROM roles WHERE title = 'memes'), 1);