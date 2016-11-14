#Функциональный TypeScript

Когда обсуждается функциональное программирование, часто разговор заходит о механизме, а не о базовых принципах. Функциональное программирование, это не про монады или моноиды, это в первую очередь про написание программ с использованием обобщённых функций. **Эта статья о применнии функционального мышления в рефакторинге TypeScript кода.**

Для этого мы будем использовать три техники:

- функции вместо примитивов
- трансформация данных через pipeline
- выделение общих (generic) функций

Начнём же!

Итак, у нас есть два класса: 
 
 *Employee (Работник)*
 
 ```typescript
 export default class Employee {
   constructor(public name: string, public salary: number) {}
 }
 ```
 
 *Department (Департамент)*
 
 ```typescript
 export default class Department {
   constructor(public employees: Employee[]) {}
 
   works(employee: Employee): boolean {
     return this.employees.indexOf(employee) > -1;
   }
 }
 ```
 
Работники имеют имена и заработные платы, а департамент - это всего лишь обычный список работников. 

Функция averageSalary это как раз то, что мы будем рефакторить:
 
```javascript
export default function averageSalary(employees: Employee[], minSalary: number, department?: Department): number {
    let total = 0;
    let count = 0;
 
    employees.forEach((e) => {
      if(minSalary <= e.salary && (department === undefined || department.works(e))){
        total += e.salary;
        count += 1;
      }
    });
 
   return total === 0 ? 0 : total / count;
}
```
  
Функция принимает список работников, минимальную заработную плату и опционально департамент. Если он задан - то посчитает среднюю заработную плату в этом департаменте, если нет - среднюю по всем департаментам. 
  
  ```javascript
  describe("average salary", () => {
    const empls = [
      new Employee("Jim", 100),
      new Employee("John", 200),
      new Employee("Liz", 120),
      new Employee("Penny", 30)
    ];
  
    const sales = new Department([empls[0], empls[1]]);
    
    it("calculates the average salary", () => { 
      expect(averageSalary(empls, 50, sales)).to.equal(150);
      expect(averageSalary(empls, 50)).to.equal(140);
    });
  });
  ```
  
  Несмотря на довольно чёткие условия, код получился немного запутанным и трудно расширяемым. Если я добавлю еще одно условие, то сигнатура функции (а таким образом и её публичный интерфейс) могут измениться, а конструкции if else могут превратить код в настоящего монстра.
  
  Давайте применим некоторые техники из функционального программирования для рефакторинга этой функции.
  
## Функции вместо примитивов

**Использание функций вместо примитивов изначально может показаться нелогичным шагом, но на самом деле это очень сильная техника для обобщения кода.** В нашем случае это означает замену параметров minSalary и department на две функции с проверкой условий.

_Шаг 1_ *(Предикат - это выражение, возвращающие истину или ложь)*

```javascript
type Predicate = (e: Employee) => boolean;

export default function averageSalary(employees: Employee[], salaryCondition: Predicate,
                       departmentCondition?: Predicate): number {
    let total = 0;
    let count = 0;

    employees.forEach((e) => {
        if(salaryCondition(e) && (departmentCondition === undefined || departmentCondition(e))){
            total += e.salary;
            count += 1;
        }
    });

    return total === 0 ? 0 : total / count;
}

// ...

expect(averageSalary(empls, (e) => e.salary > 50, (e) => sales.works(e))).toEqual(150);
```

*Мы унифицровали интерфейсы условий выборки зарплаты и департаментов.* Эта унификация позволит передавать все условия в виде массива.

_Шаг 2_
  
```javascript
function averageSalary(employees: Employee[], conditions: Predicate[]): number {
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

//...

expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).toEqual(150);
```

Теперь массив с условиями представляет из себя композицию условий, которую мы можем сделать более читаемой.

_Шаг 3_

```javascript
function and(predicates: Predicate[]): Predicate{
  return (e) => predicates.every(p => p(e));
}

function averageSalary(employees: Employee[], conditions: Predicate[]): number {
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
```

Стоит отметить, что функция "and" является общей, и должна быть вынесена в отдельную библиотеку с целью её дальнейшего переиспользования.

### Промежуточный результат

Функция averageSalary стала более надёжной. **Новые условия могут быть добавлены без изменения интерфейса функции и без изменения её имплементации.**

## Трансформация данных через pipeline

Еще одна полезная практика в функциональном программировании - это моделирование всех изменений данных в виде потока. В нашем случае это значит извлечение фильтрации из цикла.

_Шаг 4_

```javascript
function averageSalary(employees: Employee[], conditions: Predicate[]): number {
  const filtered = employees.filter(and(conditions));

  let total = 0
  let count = 0

  filtered.forEach((e) => {
    total += e.salary;
    count += 1;
  });

  return (count == 0) ? 0 : total / count;
}
```

Это изменение делает счётчик бесполезным.

_Шаг 5_

```javascript
function averageSalary(employees: Employee[], conditions: Predicate[]): number{
  const filtered = employees.filter(and(conditions));

  let total = 0
  filtered.forEach((e) => {
    total += e.salary;
  });

  return (filtered.length == 0) ? 0 : total / filtered.length;
}
```

Далее если мы выделим зарплаты отдельно, то для суммирования сможем использовать обычный reduce.

_Шаг 6_

```javascript
function averageSalary(employees: Employee[], conditions: Predicate[]): number {
  const filtered = employees.filter(and(conditions));
  const salaries = filtered.map(e => e.salary);

  const total = salaries.reduce((a,b) => a + b, 0);
  return (salaries.length == 0) ? 0 : total / salaries.length;
}
```

### Выделение обобщённых (generic) функций

Дальше мы обратим внимание на то, что последние две строчки кода не содержат никакой информации о работниках или департаментах. Фактчески это всего лишь функция для вычисления среднего значения. А значит её можно обобщить.

_Шаг 7_

```javascript
function average(nums: number[]): number {
  const total = nums.reduce((a,b) => a + b, 0);
  return (nums.length == 0) ? 0 : total / nums.length;
}

function averageSalary(employees: Employee[], conditions: Predicate[]): number {
  const filtered = employees.filter(and(conditions));
  const salaries = filtered.map(e => e.salary);
  return average(salaries);
}
```

Таким образом извлечённая функция теперь общая (generic).

После того, как мы разделили логику вычислений и фильтрации зарплат, приступим к финальному шагу.

_Шаг 8_

```javascript
function employeeSalaries(employees: Employee[], conditions: Predicate[]): number[] {
  const filtered = employees.filter(and(conditions));
  return filtered.map(e => e.salary);
}

function averageSalary(employees: Employee[], conditions: Predicate[]): number {
  return average(employeeSalaries(employees, conditions));
}
```

Сравнивая финальное решение я могу сказать, что оно лучше предыдущего. Во-первых, код более обобщён (мы можем добавить новое условие без разрыва интерфейса функции). Во-вторых, мы получили неизменяемое состояние и код стал более читаемый и более понятный.

### Когда же стоит остановиться

Функциональный стиль программирования - это написание небольших функций, которые принимают коллекции значений и возвращают новые коллекции. Эти функции могут быть переиспользованы либо объединены в разных местах. Единственный недостаток этого стиля в том, что несмотря на то, что код может стать более абстрактным, но вместе с тем он может стать и более сложным для понимания роли всех этих функций.

Я люблю использовать Лего-аналогию: кубики Лего могут быть объединены разными способами - они легко компонуются между собой. Но не все кубики одного размера. Поэтому когда вы рефакторите с использованием техник, которые были описаны в этой статье, не пытайтесь создавать функции, которые для примера берут `Array<T>`, а возвращают `Array<U>`. Конечно же в некоторых редких случаях данные можно смешивать, но такой подход значительно затруднит понимание логической цепочки кода.
  
### Подведём итоги

В этой статья я показал, как применить функциональное мышление во время рефакторинга TypeScript кода. Я сделал это применяя простые функции с трансформацией, следуя правилам:
 
 - функции вместо примитивов
 - трансформация данных через pipeline
 - выделение обобщённых (generic) функций

### Что почитать

[“JavaScript Allonge” by Reginald Braithwaite](https://leanpub.com/javascript-allonge)

[“Functional JavaScript” by Michael Fogus](http://shop.oreilly.com/product/0636920028857.do)

#### Оригинал статьи [Functional TypeScript](https://vsavkin.com/functional-typescript-316f0e003dc6#.e2t42cfeb)