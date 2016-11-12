import Employee from './Employee';

type Predicate = (e: Employee) => boolean;

export default function averageSalary(employees: Employee[], conditions: Predicate[]): number {
    let total = 0;
    let count = 0;

    employees.forEach((e) => {
        if(conditions.every(c => c(e))){
            total += e.salary;
            count += 1;
        }
    });
    return (count === 0) ? 0 : total / count;
}
