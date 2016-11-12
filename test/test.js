"use strict";

// require('./test_0');

let Employee = require('./../js/Employee').default;
let Department = require('./../js/Department').default;
let chai = require('chai');
let expect = chai.expect;

const empls = [
  new Employee("Jim", 100),
  new Employee("John", 200),
  new Employee("Liz", 120),
  new Employee("Penny", 30)
];

const sales = new Department([empls[0], empls[1]]);

describe("average salary", () => {
  let averageSalary = require('./../js/averageSalary').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, 50, sales)).to.equal(150);
    expect(averageSalary(empls, 50)).to.equal(140);
  });
});

describe("STEP - 1: average salary - Use Functions Instead of Simple Value", () => {
  let averageSalary = require('./../js/averageSalary_1').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, (e) => e.salary > 50, (e) => sales.works(e))).to.equal(150);
  });
});

describe("STEP - 2: average salary - pass all the conditions as an array", () => {
  let averageSalary = require('./../js/averageSalary_2').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).to.equal(150);
  });
});

describe("STEP - 3: average salary - pass all the conditions as an array", () => {
  let averageSalary = require('./../js/averageSalary_3').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).to.equal(150);
  });
});

describe("STEP - 4: average salary - extracting the filtering out of the loop", () => {
  let averageSalary = require('./../js/averageSalary_4').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).to.equal(150);
  });
});

describe("STEP - 5: average salary - counting unnecessary", () => {
  let averageSalary = require('./../js/averageSalary_5').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).to.equal(150);
  });
});

describe("STEP - 6: average salary - reduce salaries", () => {
  let averageSalary = require('./../js/averageSalary_6').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).to.equal(150);
  });
});

describe("STEP - 7: average salary - extract average function", () => {
  let averageSalary = require('./../js/averageSalary_7').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).to.equal(150);
  });
});

describe("STEP - 8: average salary - final solution", () => {
  let averageSalary = require('./../js/averageSalary_8').default;

  it("calculates the average salary", () => {
    expect(averageSalary(empls, [(e) => e.salary > 50, (e) => sales.works(e)])).to.equal(150);
  });
});