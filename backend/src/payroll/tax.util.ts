export function calculateThaiTax(annualIncome: number): number {
  // ยกเว้น 150,000 แรก (สำหรับเงินได้สุทธิ)
  // หักค่าใช้จ่าย 50% ไม่เกิน 100,000 และลดหย่อนส่วนตัว 60,000 ก่อน (สมมติอย่างง่าย)
  const assessableIncome = annualIncome;
  const standardDeduction = Math.min(assessableIncome * 0.5, 100000);
  const personalExemption = 60000;
  
  let netIncome = assessableIncome - standardDeduction - personalExemption;
  
  if (netIncome <= 150000) return 0;
  
  let totalTax = 0;

  // 150,001 – 300,000 (5%)
  if (netIncome > 150000) {
    const taxable = Math.min(netIncome - 150000, 150000);
    totalTax += taxable * 0.05;
  }
  // 300,001 – 500,000 (10%)
  if (netIncome > 300000) {
    const taxable = Math.min(netIncome - 300000, 200000);
    totalTax += taxable * 0.10;
  }
  // 500,001 – 750,000 (15%)
  if (netIncome > 500000) {
    const taxable = Math.min(netIncome - 500000, 250000);
    totalTax += taxable * 0.15;
  }
  // 750,001 – 1,000,000 (20%)
  if (netIncome > 750000) {
    const taxable = Math.min(netIncome - 750000, 250000);
    totalTax += taxable * 0.20;
  }
  // 1,000,001 – 2,000,000 (25%)
  if (netIncome > 1000000) {
    const taxable = Math.min(netIncome - 1000000, 1000000);
    totalTax += taxable * 0.25;
  }
  // 2,000,001 – 5,000,000 (30%)
  if (netIncome > 2000000) {
    const taxable = Math.min(netIncome - 2000000, 3000000);
    totalTax += taxable * 0.30;
  }
  // 5,000,001+ (35%)
  if (netIncome > 5000000) {
    const taxable = netIncome - 5000000;
    totalTax += taxable * 0.35;
  }

  return totalTax;
}
