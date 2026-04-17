import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll, Employee, Overtime } from '../entities';
import { calculateThaiTax } from './tax.util';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll) private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    @InjectRepository(Overtime) private overtimeRepository: Repository<Overtime>,
  ) {}

  async findAll(month?: number, year?: number) {
    const where: any = {};
    if (month) where.month = month;
    if (year) where.year = year;
    return this.payrollRepository.find({ where, relations: ['employee'], order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const p = await this.payrollRepository.findOne({ where: { id }, relations: ['employee'] });
    if (!p) throw new NotFoundException('Payroll not found');
    return p;
  }

  async create(data: Partial<Payroll>) {
    const net = Number(data.baseSalary || 0) + Number(data.bonus || 0) + Number(data.otAmount || 0) 
      - Number(data.deductions || 0) - Number(data.tax || 0) 
      - Number(data.socialSecurity || 0) - Number(data.providentFund || 0);
    const payroll = this.payrollRepository.create({ ...data, netSalary: net });
    return this.payrollRepository.save(payroll);
  }

  async generateMonthly(month: number, year: number) {
    const employees = await this.employeeRepository.find({ where: { status: 'active' as any } });
    const results: Payroll[] = [];
    
    // Construct month string prefix for OT query (e.g., '2024-03-')
    const monthStr = String(month).padStart(2, '0');
    const monthPrefix = `${year}-${monthStr}-`;

    for (const emp of employees) {
      const existing = await this.payrollRepository.findOne({ where: { employeeId: emp.id, month, year } });
      if (!existing) {
        // Calculate OT Amount
        const overtimes = await this.overtimeRepository.createQueryBuilder('ot')
          .where('ot.employeeId = :employeeId', { employeeId: emp.id })
          .andWhere('ot.date LIKE :monthPrefix', { monthPrefix: `${monthPrefix}%` })
          .andWhere('ot.approved = :approved', { approved: true })
          .getMany();
          
        const otAmount = overtimes.reduce((sum, ot) => sum + Number(ot.amount), 0);
        
        // Calculate Social Security (5% capped at 750 or 875 depending on year, we use 750 for now based on max salary 15,000)
        let socialSecurity = 0;
        if (emp.socialSecurityEnabled !== false) {
          socialSecurity = Math.min(Number(emp.salary) * 0.05, 750);
        }

        // Calculate Provident Fund
        const providentFund = emp.providentFundRate ? (Number(emp.salary) * Number(emp.providentFundRate) / 100) : 0;

        // Calculate Tax (annualized projection)
        const totalMonthlyIncome = Number(emp.salary) + otAmount;
        const projectedAnnualIncome = totalMonthlyIncome * 12;
        const annualTax = calculateThaiTax(projectedAnnualIncome);
        const tax = annualTax / 12;

        const net = totalMonthlyIncome - tax - socialSecurity - providentFund;
        
        const payroll = this.payrollRepository.create({
          employeeId: emp.id, 
          month, 
          year,
          baseSalary: emp.salary, 
          bonus: 0, 
          otAmount,
          deductions: 0, 
          socialSecurity,
          providentFund,
          tax, 
          netSalary: net,
        });
        results.push(await this.payrollRepository.save(payroll));
      }
    }
    return { generated: results.length, payrolls: results };
  }

  async markAsPaid(id: number) {
    await this.findOne(id);
    await this.payrollRepository.update(id, { isPaid: true });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.payrollRepository.delete(id);
    return { message: 'Payroll deleted' };
  }
}
