/* ==========================================================================
   FinWise - Financial Calculators Logic
   ========================================================================== */

// Helper: Format currency
function formatCurrency(amount, currency = "$") {
  const num = Number(amount);
  if (isNaN(num)) return currency + "0";
  return (
    currency +
    num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

/* ==========================================================================
   1. Compound Interest Calculator
   ========================================================================== */
function calculateCompoundInterest() {
  const initialInput = document.getElementById("ci-initial")?.value;
  const monthlyInput = document.getElementById("ci-monthly")?.value;
  const yearsInput = document.getElementById("ci-years")?.value;
  const rateInput = document.getElementById("ci-rate")?.value;
  const freqInput = document.getElementById("ci-frequency")?.value;

  const initialDeposit = parseFloat(initialInput) || 0;
  const monthlyContribution = parseFloat(monthlyInput) || 0;
  const years = parseFloat(yearsInput);
  const interestRate = (parseFloat(rateInput) || 0) / 100;
  const compoundFreq = parseInt(freqInput) || 12;

  const totalBalanceEl = document.getElementById("ci-total-balance");
  const totalDepositsEl = document.getElementById("ci-total-deposits");
  const totalInterestEl = document.getElementById("ci-total-interest");

  // Input validation: Clear results if years is invalid/zero or both deposits are zero
  if (isNaN(years) || years <= 0 || (initialDeposit <= 0 && monthlyContribution <= 0)) {
    if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(0);
    if (totalDepositsEl) totalDepositsEl.textContent = formatCurrency(0);
    if (totalInterestEl) totalInterestEl.textContent = formatCurrency(0);
    renderCompoundChart(0, 0, 0);
    renderCompoundTable([]);
    return;
  }

  const totalMonths = Math.round(years * 12);
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

  const totalInterest = Math.max(0, balance - totalDeposited);

  // Update DOM Results
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

  if (total <= 0) {
    chartEl.innerHTML = "";
    return;
  }

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

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1rem;">Enter principal and timeframe to view annual schedule.</td></tr>`;
    return;
  }

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
  const principalInput = document.getElementById("loan-amount")?.value;
  const rateInput = document.getElementById("loan-rate")?.value;
  const termInput = document.getElementById("loan-term")?.value;

  const principal = parseFloat(principalInput);
  const annualRate = (parseFloat(rateInput) || 0) / 100;
  const termYears = parseFloat(termInput);

  const emiEl = document.getElementById("loan-monthly-emi");
  const totalPrincipalEl = document.getElementById("loan-total-principal");
  const totalInterestEl = document.getElementById("loan-total-interest");
  const totalPayEl = document.getElementById("loan-total-pay");

  // Input validation: Clear results if principal or term is invalid/zero
  if (isNaN(principal) || principal <= 0 || isNaN(termYears) || termYears <= 0) {
    if (emiEl) emiEl.textContent = formatCurrency(0);
    if (totalPrincipalEl) totalPrincipalEl.textContent = formatCurrency(0);
    if (totalInterestEl) totalInterestEl.textContent = formatCurrency(0);
    if (totalPayEl) totalPayEl.textContent = formatCurrency(0);
    renderLoanAmortization(0, 0, 0, 0);
    return;
  }

  const totalPayments = Math.round(termYears * 12);
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
  const totalInterest = Math.max(0, totalPayment - principal);

  // Update DOM
  if (emiEl) emiEl.textContent = formatCurrency(monthlyPayment);
  if (totalPrincipalEl) totalPrincipalEl.textContent = formatCurrency(principal);
  if (totalInterestEl) totalInterestEl.textContent = formatCurrency(totalInterest);
  if (totalPayEl) totalPayEl.textContent = formatCurrency(totalPayment);

  // Render Amortization Preview
  renderLoanAmortization(principal, monthlyRate, monthlyPayment, totalPayments);
}

function renderLoanAmortization(principal, monthlyRate, monthlyPayment, totalPayments) {
  const tbody = document.getElementById("loan-amortization-body");
  if (!tbody) return;

  if (principal <= 0 || totalPayments <= 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1rem;">Enter loan amount and term to view amortization schedule.</td></tr>`;
    return;
  }

  let balance = principal;
  let rowsHtml = "";
  let currentMonth = 0;
  const maxYearsToDisplay = Math.min(10, Math.ceil(totalPayments / 12));

  for (let year = 1; year <= maxYearsToDisplay; year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0 || currentMonth >= totalPayments) break;
      currentMonth++;

      const interestForMonth = balance * monthlyRate;
      let principalForMonth = monthlyPayment - interestForMonth;

      // Bound final payment so principal repaid never exceeds remaining balance
      if (principalForMonth > balance || currentMonth === totalPayments) {
        principalForMonth = balance;
      }

      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      balance -= principalForMonth;

      if (balance <= 1e-6) {
        balance = 0;
        break;
      }
    }

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
  const incomeInput = document.getElementById("budget-income")?.value;
  const income = parseFloat(incomeInput);

  const needsEl = document.getElementById("budget-needs");
  const wantsEl = document.getElementById("budget-wants");
  const savingsEl = document.getElementById("budget-savings");

  // Input validation: Clear results if income is invalid or <= 0
  if (isNaN(income) || income <= 0) {
    if (needsEl) needsEl.textContent = formatCurrency(0);
    if (wantsEl) wantsEl.textContent = formatCurrency(0);
    if (savingsEl) savingsEl.textContent = formatCurrency(0);
    return;
  }

  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  if (needsEl) needsEl.textContent = formatCurrency(needs);
  if (wantsEl) wantsEl.textContent = formatCurrency(wants);
  if (savingsEl) savingsEl.textContent = formatCurrency(savings);
}

/* ==========================================================================
   4. Retirement & FIRE Calculator
   ========================================================================== */
function calculateRetirement() {
  const ageVal = document.getElementById("fire-age")?.value;
  const currentAge = (ageVal !== undefined && ageVal.trim() !== "" && !isNaN(parseFloat(ageVal))) ? parseFloat(ageVal) : 30;

  const retireAgeVal = document.getElementById("fire-retire-age")?.value;
  const retirementAge = (retireAgeVal !== undefined && retireAgeVal.trim() !== "" && !isNaN(parseFloat(retireAgeVal))) ? parseFloat(retireAgeVal) : 60;

  const savingsVal = document.getElementById("fire-savings")?.value;
  const currentSavings = (savingsVal !== undefined && savingsVal.trim() !== "" && !isNaN(parseFloat(savingsVal))) ? parseFloat(savingsVal) : 0;

  const monthlyVal = document.getElementById("fire-monthly")?.value;
  const monthlyDeposit = (monthlyVal !== undefined && monthlyVal.trim() !== "" && !isNaN(parseFloat(monthlyVal))) ? parseFloat(monthlyVal) : 0;

  // Bug 3 Fix: Distinguish 0 from missing or empty string
  const returnVal = document.getElementById("fire-return")?.value;
  const annualReturn = ((returnVal !== undefined && returnVal.trim() !== "" && !isNaN(parseFloat(returnVal))) ? parseFloat(returnVal) : 7) / 100;

  const expVal = document.getElementById("fire-expenses")?.value;
  const desiredExpenses = (expVal !== undefined && expVal.trim() !== "" && !isNaN(parseFloat(expVal))) ? parseFloat(expVal) : 40000;

  // Bug 7 Fix: Update result heading to reflect actual target retirement age
  const labelEl = document.getElementById("fire-nest-egg-label") || document.querySelector(".calc-results .result-main .label");
  if (labelEl) {
    labelEl.textContent = `Projected Nest Egg at Age ${retirementAge}`;
  }

  const nestEggEl = document.getElementById("fire-nest-egg");
  const targetEl = document.getElementById("fire-target");
  const safeIncomeEl = document.getElementById("fire-safe-income");
  const statusEl = document.getElementById("fire-status");

  // Input validation: If retirement age <= current age, display current savings and validation warning
  if (retirementAge <= currentAge) {
    if (nestEggEl) nestEggEl.textContent = formatCurrency(currentSavings);
    if (targetEl) targetEl.textContent = formatCurrency(desiredExpenses * 25);
    if (safeIncomeEl) safeIncomeEl.textContent = formatCurrency(currentSavings * 0.04);
    if (statusEl) {
      statusEl.innerHTML = `<span style="color: #dc2626; font-weight:700;">⚠️ Retirement age must be greater than current age (${currentAge}).</span>`;
    }
    return;
  }

  const yearsToRetire = retirementAge - currentAge;
  const monthlyRate = annualReturn / 12;
  const totalMonths = Math.round(yearsToRetire * 12);

  let nestEgg = currentSavings;
  for (let m = 0; m < totalMonths; m++) {
    nestEgg += monthlyDeposit;
    nestEgg += nestEgg * monthlyRate;
  }

  // 4% Safe Withdrawal Target
  const targetNestEgg = desiredExpenses * 25;
  const safeAnnualIncome = nestEgg * 0.04;

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

/* ==========================================================================
   5. Inflation & Purchasing Power Calculator
   ========================================================================== */
function calculateInflation() {
  const amountInput = document.getElementById("inf-amount")?.value;
  const rateInput = document.getElementById("inf-rate")?.value;
  const yearsInput = document.getElementById("inf-years")?.value;

  const currentAmount = parseFloat(amountInput);
  const inflationRate = (parseFloat(rateInput) || 0) / 100;
  const years = parseFloat(yearsInput);

  const futureCostEl = document.getElementById("inf-future-cost");
  const powerEl = document.getElementById("inf-purchasing-power");
  const lossPercentEl = document.getElementById("inf-loss-percent");

  // Input validation: Clear results if amount or years is invalid/zero
  if (isNaN(currentAmount) || currentAmount <= 0 || isNaN(years) || years <= 0) {
    if (futureCostEl) futureCostEl.textContent = formatCurrency(0);
    if (powerEl) powerEl.textContent = formatCurrency(0);
    if (lossPercentEl) lossPercentEl.textContent = "0%";
    renderInflationTable(0, 0, 0);
    return;
  }

  // Future price of same basket of goods
  const futureCost = currentAmount * Math.pow(1 + inflationRate, years);

  // Future purchasing power of current dollar amount
  const futurePurchasingPower = currentAmount / Math.pow(1 + inflationRate, years);
  const purchasingPowerLossPercent = Math.round((1 - futurePurchasingPower / currentAmount) * 100);

  // Update DOM
  if (futureCostEl) futureCostEl.textContent = formatCurrency(futureCost);
  if (powerEl) powerEl.textContent = formatCurrency(futurePurchasingPower);
  if (lossPercentEl) lossPercentEl.textContent = `${purchasingPowerLossPercent}%`;

  // Render Table Breakdown
  renderInflationTable(currentAmount, inflationRate, years);
}

function renderInflationTable(initialAmount, rate, totalYears) {
  const tbody = document.getElementById("inf-table-body");
  if (!tbody) return;

  if (initialAmount <= 0 || totalYears <= 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1rem;">Enter amount and years to calculate inflation impact.</td></tr>`;
    return;
  }

  let rowsHtml = "";
  const maxYears = Math.min(25, Math.round(totalYears));

  for (let y = 1; y <= maxYears; y++) {
    const costAtYear = initialAmount * Math.pow(1 + rate, y);
    const powerAtYear = initialAmount / Math.pow(1 + rate, y);
    const lossPct = Math.round((1 - powerAtYear / initialAmount) * 100);

    rowsHtml += `
      <tr>
        <td>Year ${y}</td>
        <td><strong>${formatCurrency(costAtYear)}</strong></td>
        <td>${formatCurrency(powerAtYear)}</td>
        <td style="color:#dc2626; font-weight:600;">-${lossPct}%</td>
      </tr>
    `;
  }

  tbody.innerHTML = rowsHtml;
}

/* ==========================================================================
   6. Auto Loan & Financing Calculator
   ========================================================================== */
function calculateAutoLoan() {
  const priceInput = document.getElementById("auto-price")?.value;
  const downInput = document.getElementById("auto-down")?.value;
  const tradeInput = document.getElementById("auto-tradein")?.value;
  const taxInput = document.getElementById("auto-tax")?.value;
  const rateInput = document.getElementById("auto-rate")?.value;
  const termInput = document.getElementById("auto-term")?.value;

  const price = parseFloat(priceInput);
  const downPayment = parseFloat(downInput) || 0;
  const tradeIn = parseFloat(tradeInput) || 0;
  const taxRate = (parseFloat(taxInput) || 0) / 100;
  const annualRate = (parseFloat(rateInput) || 0) / 100;
  const termMonths = parseInt(termInput);

  const paymentEl = document.getElementById("auto-monthly-payment");
  const principalEl = document.getElementById("auto-principal");
  const interestEl = document.getElementById("auto-interest");
  const taxEl = document.getElementById("auto-tax-amount");
  const totalCostEl = document.getElementById("auto-total-cost");

  // Input validation: Clear results if price or term is invalid/zero
  if (isNaN(price) || price <= 0 || isNaN(termMonths) || termMonths <= 0) {
    if (paymentEl) paymentEl.textContent = formatCurrency(0);
    if (principalEl) principalEl.textContent = formatCurrency(0);
    if (interestEl) interestEl.textContent = formatCurrency(0);
    if (taxEl) taxEl.textContent = formatCurrency(0);
    if (totalCostEl) totalCostEl.textContent = formatCurrency(0);
    return;
  }

  const taxableAmount = Math.max(0, price - tradeIn);
  const totalTax = taxableAmount * taxRate;
  const totalPurchasePrice = price + totalTax;

  // Bug 5 Fix: Cap trade-in and down payment at total purchase price to avoid inflating total cost
  const effectiveTradeIn = Math.min(tradeIn, totalPurchasePrice);
  const effectiveDownPayment = Math.min(downPayment, Math.max(0, totalPurchasePrice - effectiveTradeIn));
  const totalToFinance = Math.max(0, totalPurchasePrice - effectiveTradeIn - effectiveDownPayment);

  const monthlyRate = annualRate / 12;
  let monthlyPayment = 0;

  if (totalToFinance > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = totalToFinance / termMonths;
    } else {
      monthlyPayment =
        (totalToFinance * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
  }

  const totalPayments = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalPayments - totalToFinance);
  // Total cost is capped: effective upfront payments + total loan payments
  const totalCost = effectiveDownPayment + effectiveTradeIn + totalPayments;

  // Update DOM
  if (paymentEl) paymentEl.textContent = formatCurrency(monthlyPayment);
  if (principalEl) principalEl.textContent = formatCurrency(totalToFinance);
  if (interestEl) interestEl.textContent = formatCurrency(totalInterest);
  if (taxEl) taxEl.textContent = formatCurrency(totalTax);
  if (totalCostEl) totalCostEl.textContent = formatCurrency(totalCost);
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

  // Bind Inflation
  const infInputs = ["inf-amount", "inf-rate", "inf-years"];
  infInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateInflation);
  });
  if (document.getElementById("inf-amount")) calculateInflation();

  // Bind Auto Loan
  const autoInputs = ["auto-price", "auto-down", "auto-tradein", "auto-tax", "auto-rate", "auto-term"];
  autoInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateAutoLoan);
  });
  if (document.getElementById("auto-price")) calculateAutoLoan();
});
