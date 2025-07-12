document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let shouldResetDisplay = false;

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('.btn')) return;

        const value = e.target.dataset.value;
        const type = e.target.classList.contains('number') ? 'number' : 'operator';

        if (type === 'number') {
            handleNumber(value);
        } else if (type === 'operator') {
            handleOperator(value);
        }
        updateDisplay();
    });

    function handleNumber(value) {
        if (value === '.' && currentInput.includes('.')) {
            return;
        }
        
        if (shouldResetDisplay) {
            currentInput = value;
            shouldResetDisplay = false;
        } else {
            currentInput = currentInput === '0' && value !== '.' ? value : currentInput + value;
        }
    }

    function handleOperator(value) {
        switch (value) {
            case 'AC':
                resetCalculator();
                break;
            case '+/-':
                if (shouldResetDisplay) return;
                currentInput = (parseFloat(currentInput) * -1).toString();
                break;
            case '%':
                if (shouldResetDisplay) return;
                currentInput = (parseFloat(currentInput) / 100).toString();
                break;
            case '=':
                if (operator && previousInput !== null) {
                    currentInput = calculate();
                    operator = null;
                    previousInput = null;
                    shouldResetDisplay = true;
                }
                break;
            default: // +, -, *, /
                if (currentInput === 'Error') {
                    resetCalculator();
                    return;
                }
                if (operator && !shouldResetDisplay) {
                    currentInput = calculate();
                    if (currentInput === 'Error') {
                        updateDisplay();
                        // エラー表示後リセットするため、状態はリセットしない
                        return;
                    }
                }
                operator = value;
                previousInput = currentInput;
                shouldResetDisplay = true;
                break;
        }
    }

    function calculate() {
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return 'Error';

        let result;
        switch (operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '*': result = prev * current; break;
            case '/':
                if (current === 0) return 'Error';
                result = prev / current;
                break;
            default: return current.toString();
        }
        // 指数表記を避けるため、toFixedとparseFloatで調整
        if (result.toString().includes('e')) {
            return result.toPrecision(15);
        }
        return parseFloat(result.toFixed(10)).toString();
    }

    function resetCalculator() {
        currentInput = '0';
        operator = null;
        previousInput = null;
        shouldResetDisplay = false;
    }

    function updateDisplay() {
        const operatorSymbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷',
        };

        let displayText = currentInput;

        // 数字の長さに応じてフォントサイズを調整
        if (displayText.length > 9) {
            display.style.fontSize = '2rem';
        } else if (displayText.length > 6) {
             display.style.fontSize = '2.5rem';
        }
        else {
            display.style.fontSize = '3rem';
        }
        
        display.textContent = displayText;
    }

    resetCalculator();
    updateDisplay();
});
