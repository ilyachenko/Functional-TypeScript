import Employee from './Employee';

type Predicate = (e: Employee) => boolean;

function and(predicates: Predicate[]): Predicate {
    return (e) => predicates.every(p => p(e));
}

export default function averageSalary(employees: Employee[], conditions: Predicate[]): number {
    let total = 0;
    let count = 0;

    employees.forEach((e) => {
        if(and(conditions)(e)){
            total += e.salary;
            count += 1;
        }
    });
    return (count == 0) ? 0 : total / count;
}