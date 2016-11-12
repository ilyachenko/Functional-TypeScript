import Employee from './Employee';

type Predicate = (e: Employee) => boolean;

function and(predicates: Predicate[]): Predicate {
    return (e) => predicates.every(p => p(e));
}

export default function averageSalary(employees: Employee[], conditions: Predicate[]): number {
    const filtered = employees.filter(and(conditions));
    const salaries = filtered.map(e => e.salary);

    const total = salaries.reduce((a,b) => a + b, 0);
    return (salaries.length == 0) ? 0 : total / salaries.length;
}