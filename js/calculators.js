/* ==========================================================================
   FinWise - Financial Calculators Logic
   ========================================================================== */

// Helper: Format currency
function formatCurrency(amount, currency = "$") {
  return (
    currency +
    Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

/* ==========================================================================
   1. Compound Interest Calculator
   ========================================================================== */
function calculateCompoundInterest() {
  const initialDeposit = parseFloat(document.getElementById("ci-initial")?.value) || 0;
  const monthlyContribution = parseFloat(document.getElementById("ci-monthly")?.value) || 0;
  const years = parseFloat(document.getElementById("ci-years")?.value) || 0;
  const interestRate = (parseFloat(document.getElementById("ci-rate")?.value) || 0) / 100;
  const compoundFreq = parseInt(document.getElementById("ci-frequency")?.value) || 12;

  if (years <= 0) return;

  const totalMonths = years * 12;
  const monthlyRate = interestRate / 12;

  let balance = initialDeposit;
  let totalDeposited = initialDeposit;
  const yearlyData = [];

  for (let m = 1; m <= totalMonths; m++) {
    balance += monthlyContribution;
    totalDeposited += monthlyContribution;
    balance += balance * monthlyRate;

    if (m % 12 === 0 || m === totalMonths) {
      yearlyData.push({
        year: Math.ceil(m / 12),
        deposits: Math.round(totalDeposited),
        interest: Math.round(balance - totalDeposited),
        balance: Math.round(balance),
      });
    }
  }

  const totalInterest = balance - totalDeposited;

  // Update DOM Results
  const totalBalanceEl = document.getElementById("ci-total-balance");
  const totalDepositsEl = document.getElementById("ci-total-deposits");
  const totalInterestEl = document.getElementById("ci-total-interest");

  if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(balance);
  if (totalDepositsEl) totalDepositsEl.textContent = formatCurrency(totalDeposited);
  if (totalInterestEl) totalInterestEl.textContent = formatCurrency(totalInterest);

  // Render Bar Visualization
  renderCompoundChart(totalDeposited, totalInterest, balance);

  // Render Breakdown Table if present
  renderCompoundTable(yearlyData);
}

function renderCompoundChart(deposits, interest, total) {
  const chartEl = document.getElementById("ci-chart-bar");
  if (!chartEl) return;

  const depositPercent = Math.max(5, Math.min(95, (deposits / total) * 100));
  const interestPercent = 100 - depositPercent;

  chartEl.innerHTML = `
    <div style="display:flex; height: 32px; border-radius: 8px; overflow: hidden; margin-bottom: 0.75rem; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
      <div style="width: ${depositPercent}%; background: #2563eb; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:700;">
        ${Math.round(depositPercent)}% Deposits
      </div>
      <div style="width: ${interestPercent}%; background: #059669; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.75rem; font-weight:700;">
        ${Math.round(interestPercent)}% Interest
      </div>
    </div>
  `;
}

function renderCompoundTable(data) {
  const tbody = document.getElementById("ci-table-body");
  if (!tbody) return;

  tbody.innerHTML = data
    .map(
      (row) => `
    <tr>
      <td>Year ${row.year}</td>
      <td>${formatCurrency(row.deposits)}</td>
      <td style="color: #059669; font-weight:600;">${formatCurrency(row.interest)}</td>
      <td><strong>${formatCurrency(row.balance)}</strong></td>
    </tr>
  `
    )
    .join("");
}

/* ==========================================================================
   2. Loan & EMI Calculator
   ========================================================================== */
function calculateLoan() {
  const principal = parseFloat(document.getElementById("loan-amount")?.value) || 0;
  const annualRate = (parseFloat(document.getElementById("loan-rate")?.value) || 0) / 100;
  const termYears = parseFloat(document.getElementById("loan-term")?.value) || 0;

  if (principal <= 0 || termYears <= 0) return;

  const totalPayments = termYears * 12;
  const monthlyRate = annualRate / 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalPayments;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }

  const totalPayment = monthlyPayment * totalPayments;
  const totalInterest = totalPayment - principal;

  // Update DOM
  const emiEl = document.getElementById("loan-monthly-emi");
  const totalPrincipalEl = document.getElementById("loan-total-principal");
  const totalInterestEl = document.getElementById("loan-total-interest");
  const totalPayEl = document.getElementById("loan-total-pay");

  if (emiEl) emiEl.textContent = formatCurrency(monthlyPayment);
  if (totalPrincipalEl) totalPrincipalEl.textContent = formatCurrency(principal);
  if (totalInterestEl) totalInterestEl.textContent = formatCurrency(totalInterest);
  if (totalPayEl) totalPayEl.textContent = formatCurrency(totalPayment);

  // Render Amortization Preview (First 5 years)
  renderLoanAmortization(principal, monthlyRate, monthlyPayment, totalPayments);
}

function renderLoanAmortization(principal, monthlyRate, monthlyPayment, totalPayments) {
  const tbody = document.getElementById("loan-amortization-body");
  if (!tbody) return;

  let balance = principal;
  let rowsHtml = "";
  const maxYearsToDisplay = Math.min(10, Math.ceil(totalPayments / 12));

  for (let year = 1; year <= maxYearsToDisplay; year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) break;
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      balance -= principalForMonth;
    }

    if (balance < 0) balance = 0;

    rowsHtml += `
      <tr>
        <td>Year ${year}</td>
        <td>${formatCurrency(yearPrincipal)}</td>
        <td style="color:#dc2626;">${formatCurrency(yearInterest)}</td>
        <td><strong>${formatCurrency(balance)}</strong></td>
      </tr>
    `;
    if (balance <= 0) break;
  }

  tbody.innerHTML = rowsHtml;
}

/* ==========================================================================
   3. 50/30/20 Budget Planner
   ========================================================================== */
function calculateBudget() {
  const income = parseFloat(document.getElementById("budget-income")?.value) || 0;
  if (income <= 0) return;

  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  const needsEl = document.getElementById("budget-needs");
  const wantsEl = document.getElementById("budget-wants");
  const savingsEl = document.getElementById("budget-savings");

  if (needsEl) needsEl.textContent = formatCurrency(needs);
  if (wantsEl) wantsEl.textContent = formatCurrency(wants);
  if (savingsEl) savingsEl.textContent = formatCurrency(savings);
}

/* ==========================================================================
   4. Retirement & FIRE Calculator
   ========================================================================== */
function calculateRetirement() {
  const currentAge = parseFloat(document.getElementById("fire-age")?.value) || 30;
  const retirementAge = parseFloat(document.getElementById("fire-retire-age")?.value) || 60;
  const currentSavings = parseFloat(document.getElementById("fire-savings")?.value) || 0;
  const monthlyDeposit = parseFloat(document.getElementById("fire-monthly")?.value) || 0;
  const annualReturn = (parseFloat(document.getElementById("fire-return")?.value) || 7) / 100;
  const desiredExpenses = parseFloat(document.getElementById("fire-expenses")?.value) || 40000;

  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const monthlyRate = annualReturn / 12;
  const totalMonths = yearsToRetire * 12;

  let nestEgg = currentSavings;
  for (let m = 0; m < totalMonths; m++) {
    nestEgg += monthlyDeposit;
    nestEgg += nestEgg * monthlyRate;
  }

  // 4% Safe Withdrawal Target
  const targetNestEgg = desiredExpenses * 25;
  const safeAnnualIncome = nestEgg * 0.04;

  const nestEggEl = document.getElementById("fire-nest-egg");
  const targetEl = document.getElementById("fire-target");
  const safeIncomeEl = document.getElementById("fire-safe-income");
  const statusEl = document.getElementById("fire-status");

  if (nestEggEl) nestEggEl.textContent = formatCurrency(nestEgg);
  if (targetEl) targetEl.textContent = formatCurrency(targetNestEgg);
  if (safeIncomeEl) safeIncomeEl.textContent = formatCurrency(safeAnnualIncome);

  if (statusEl) {
    if (nestEgg >= targetNestEgg) {
      statusEl.innerHTML = `<span style="color: #059669; font-weight:700;">✅ On Track! You will reach your retirement target.</span>`;
    } else {
      const shortage = targetNestEgg - nestEgg;
      statusEl.innerHTML = `<span style="color: #d97706; font-weight:700;">⚠️ Projected shortfall of ${formatCurrency(shortage)}. Consider increasing monthly savings.</span>`;
    }
  }
}

// Global Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Bind Compound Interest
  const ciInputs = ["ci-initial", "ci-monthly", "ci-years", "ci-rate", "ci-frequency"];
  ciInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateCompoundInterest);
  });
  if (document.getElementById("ci-initial")) calculateCompoundInterest();

  // Bind Loan Calculator
  const loanInputs = ["loan-amount", "loan-rate", "loan-term"];
  loanInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateLoan);
  });
  if (document.getElementById("loan-amount")) calculateLoan();

  // Bind Budget Planner
  const budgetInput = document.getElementById("budget-income");
  if (budgetInput) {
    budgetInput.addEventListener("input", calculateBudget);
    calculateBudget();
  }

  // Bind Retirement
  const fireInputs = ["fire-age", "fire-retire-age", "fire-savings", "fire-monthly", "fire-return", "fire-expenses"];
  fireInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateRetirement);
  });
  if (document.getElementById("fire-age")) calculateRetirement();
});

