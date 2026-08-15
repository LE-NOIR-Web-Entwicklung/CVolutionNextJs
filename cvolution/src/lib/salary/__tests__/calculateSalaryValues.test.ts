import { buildCalculatedValues } from "../calculateSalaryValues";

const c1 = buildCalculatedValues({ monthlyGrossSalary: null, annualGrossSalary: 95000, workloadPercent: 100, thirteenthSalary: null, benchmark: { minimumSalary: 90000, medianSalary: 100000, maximumSalary: 120000 } });
console.assert(c1.differenceToMedianChf === -5000);
console.assert(Math.round(c1.differenceToMedianPercent || 0) === -5);

const c2 = buildCalculatedValues({ monthlyGrossSalary: 6000, annualGrossSalary: null, workloadPercent: 80, thirteenthSalary: "yes", benchmark: null });
console.assert(c2.annualGrossSalary === 78000);
console.assert(c2.fullTimeEquivalentSalary === 97500);
