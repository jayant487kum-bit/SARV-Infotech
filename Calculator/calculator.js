const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const buttons = document.getElementById("buttons");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");

let currentValue = "";
let previousValue = "";
let operation = null;
let shouldResetDisplay = false;


// ------------------------------------
// DISPLAY
// ------------------------------------

function updateDisplay() {

    // If nothing has been entered, show zero.
    if (currentValue === "") {
        currentDisplay.textContent = "0";
    } else {
        currentDisplay.textContent = currentValue;
    }

    if (previousValue !== "" && operation !== null) {
        previousDisplay.textContent =
            `${previousValue} ${operation}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// ------------------------------------
// NUMBER INPUT
// ------------------------------------

function inputNumber(number) {

    if (shouldResetDisplay) {
        currentValue = "";
        shouldResetDisplay = false;
    }

    // Prevent multiple decimal points.
    if (number === "." && currentValue.includes(".")) {
        return;
    }

    // Prevent unnecessary leading zeroes.
    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


// ------------------------------------
// OPERATION
// ------------------------------------

function chooseOperation(selectedOperation) {

    if (currentValue === "" && previousValue === "") {
        return;
    }

    // If an operation already exists, calculate first.
    if (operation !== null && currentValue !== "") {
        calculate();
    }

    previousValue = currentValue;
    operation = selectedOperation;
    shouldResetDisplay = true;

    updateDisplay();
}


// ------------------------------------
// CALCULATIONS
// ------------------------------------

function calculate() {

    if (
        previousValue === "" ||
        currentValue === "" ||
        operation === null
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    // if/else statements handle each operator.
    if (operation === "+") {

        result = firstNumber + secondNumber;

    } else if (operation === "−") {

        result = firstNumber - secondNumber;

    } else if (operation === "×") {

        result = firstNumber * secondNumber;

    } else if (operation === "÷") {

        if (secondNumber === 0) {
            currentDisplay.textContent = "ERROR";
            previousDisplay.textContent = "Cannot divide by zero";

            currentValue = "";
            previousValue = "";
            operation = null;

            return;
        }

        result = firstNumber / secondNumber;

    } else if (operation === "%") {

        result = firstNumber % secondNumber;
    }

    // Round very long decimal results.
    result = Number(result.toFixed(10));

    addToHistory(
        `${firstNumber} ${operation} ${secondNumber}`,
        result
    );

    currentValue = result.toString();
    previousValue = "";
    operation = null;
    shouldResetDisplay = true;

    updateDisplay();
}


// ------------------------------------
// DELETE
// ------------------------------------

function deleteLastCharacter() {

    if (shouldResetDisplay) {
        return;
    }

    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}


// ------------------------------------
// CLEAR
// ------------------------------------

function clearCalculator() {

    currentValue = "";
    previousValue = "";
    operation = null;
    shouldResetDisplay = false;

    updateDisplay();
}


// ------------------------------------
// HISTORY
// ------------------------------------

function addToHistory(expression, result) {

    const listItem = document.createElement("li");

    listItem.innerHTML = `
        <span>${expression}</span>
        <strong>${result}</strong>
    `;

    historyList.prepend(listItem);

    // Keep only the latest 6 calculations.
    while (historyList.children.length > 6) {
        historyList.removeChild(historyList.lastChild);
    }
}


// ------------------------------------
// BUTTON EVENT LISTENER
// ------------------------------------

buttons.addEventListener("click", function(event) {

    const button = event.target;

    if (!button.matches("button")) {
        return;
    }

    const number = button.dataset.number;
    const selectedOperation = button.dataset.operation;
    const action = button.dataset.action;

    // Number or decimal button
    if (number !== undefined) {

        inputNumber(number);

    // Operator button
    } else if (selectedOperation !== undefined) {

        chooseOperation(selectedOperation);

    // Other actions
    } else if (action === "clear") {

        clearCalculator();

    } else if (action === "delete") {

        deleteLastCharacter();

    } else if (action === "calculate") {

        calculate();
    }
});


// ------------------------------------
// KEYBOARD SUPPORT
// ------------------------------------

document.addEventListener("keydown", function(event) {

    const key = event.key;

    // Numbers and decimal
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        inputNumber(key);

    } else if (key === "+") {

        chooseOperation("+");

    } else if (key === "-") {

        chooseOperation("−");

    } else if (key === "*") {

        chooseOperation("×");

    } else if (key === "/") {

        event.preventDefault();
        chooseOperation("÷");

    } else if (key === "%") {

        chooseOperation("%");

    } else if (key === "Enter" || key === "=") {

        calculate();

    } else if (key === "Backspace") {

        deleteLastCharacter();

    } else if (key === "Escape") {

        clearCalculator();
    }
});


// ------------------------------------
// CLEAR HISTORY
// ------------------------------------

clearHistoryButton.addEventListener("click", function() {

    // Loop through history items and remove them.
    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }
});


// Initial display
updateDisplay();