import Employee from './Employee';

type Predicate = (e: Employee) => boolean;

function and(predicates: Predicate[]): Predicate {
    return (e) => predicates.every(p => p(e));
}

function average(nums: number[]): number {
    const total = nums.reduce((a,b) => a + b, 0);
    return (nums.length == 0) ? 0 : total / nums.length;
}

function employeeSalaries(employees: Employee[], conditions: Predicate[]): number[] {
    const filtered = employees.filter(and(conditions));
    return filtered.map(e => e.salary);
}

export default function averageSalary(employees: Employee[], conditions: Predicate[]): number {
    return average(employeeSalaries(employees, conditions));
}