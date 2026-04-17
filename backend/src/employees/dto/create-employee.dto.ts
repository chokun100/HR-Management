import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { EmployeeStatus } from '../../entities/employee.entity';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsNotEmpty()
  hireDate: string;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsNumber()
  @IsNotEmpty()
  salary: number;

  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @IsNumber()
  @IsOptional()
  positionId?: number;

  @IsNumber()
  @IsOptional()
  providentFundRate?: number;

  @IsBoolean()
  @IsOptional()
  socialSecurityEnabled?: boolean;
}
