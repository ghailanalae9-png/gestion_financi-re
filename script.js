const salaryInput = document.getElementById("salary");
const expenseInputs = [...document.querySelectorAll(".expense")];

const money = (amount) =>
  amount.toLocaleString("fr-FR", {
    maximumFractionDigits: 2
  }) + " DH";

function getBudget() {
  const salary = Number(salaryInput.value);
  const values = expenseInputs.map(input => Number(input.value));

  const validSalary =
    salaryInput.value.trim() !== "" &&
    Number.isFinite(salary) &&
    salary >= 0;

  const validExpenses = expenseInputs.every(input =>
    input.value.trim() !== "" &&
    Number.isFinite(Number(input.value)) &&
    Number(input.value) >= 0
  );

  if (!validSalary || !validExpenses) {
    return null;
  }

  const expenses = values.reduce((total, value) => total + value, 0);
  const balance = salary - expenses;

  return { salary, expenses, balance };
}

function calculateBudget() {
  const budget = getBudget();
  const advice = document.getElementById("advice");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  if (!budget) {
    advice.className = "advice warning";
    advice.textContent =
      "Veuillez saisir un salaire et des montants valides, égaux ou supérieurs à zéro.";
    document.getElementById("salaryResult").textContent = "—";
    document.getElementById("expensesResult").textContent = "—";
    document.getElementById("savingsResult").textContent = "—";
    document.getElementById("balanceResult").textContent = "—";
    progressBar.style.width = "0%";
    progressText.textContent = "Vérifiez les montants saisis.";
    return;
  }

  const { salary, expenses, balance } = budget;

  document.getElementById("salaryResult").textContent = money(salary);
  document.getElementById("expensesResult").textContent = money(expenses);
  document.getElementById("savingsResult").textContent = money(Math.max(0, balance));
  document.getElementById("balanceResult").textContent =
    balance < 0 ? "-" + money(Math.abs(balance)) : money(balance);

  const percentage = salary > 0
    ? Math.min(100, (expenses / salary) * 100)
    : (expenses > 0 ? 100 : 0);

  progressBar.style.width = percentage + "%";
  progressText.textContent =
    `Vous utilisez ${percentage.toFixed(1)} % de votre salaire pour vos dépenses.`;

  advice.className = "advice";

  if (salary === 0 && expenses === 0) {
    advice.textContent = "Saisissez votre salaire pour commencer votre budget.";
  } else if (balance < 0) {
    advice.classList.add("warning");
    advice.textContent =
      `Attention ! Vos dépenses dépassent votre salaire de ${money(Math.abs(balance))}. ` +
      "Réduisez certaines dépenses ou revoyez votre budget.";
  } else if (balance === 0) {
    advice.textContent =
      "Votre salaire est entièrement utilisé. Essayez de prévoir une petite épargne.";
  } else {
    advice.textContent =
      `Il vous reste ${money(balance)} après vos dépenses. ` +
      "Vous pouvez réserver cette somme à l'épargne ou à vos objectifs.";
  }
}

document.getElementById("calculate").addEventListener("click", calculateBudget);

document.getElementById("showAnswers").addEventListener("click", () => {
  document.getElementById("answers").classList.toggle("hidden");
});

salaryInput.addEventListener("input", calculateBudget);
expenseInputs.forEach(input =>
  input.addEventListener("input", calculateBudget)
);

document.getElementById("q1").addEventListener("focus", () => {
  const budget = getBudget();
  if (budget) {
    document.getElementById("q1").placeholder =
      `Exemple : ${money(budget.expenses)}`;
  }
});

document.getElementById("q2").addEventListener("focus", () => {
  const budget = getBudget();
  if (budget) {
    document.getElementById("q2").placeholder =
      `Exemple : ${money(Math.max(0, budget.balance))}`;
  }
});

calculateBudget();
