import Employee from './Employee';

type Predicate = (e: Employee) => boolean;

function and(predicates: Predicate[]): Predicate {
    return (e) => predicates.every(p => p(e));
}

export default function averageSalary(employees: Employee[], conditions: Predicate[]): number{
    const filtered = employees.filter(and(conditions));

    let total = 0;
    filtered.forEach((e) => {
        total += e.salary;
    });

    return (filtered.length == 0) ? 0 : total / filtered.length;
}