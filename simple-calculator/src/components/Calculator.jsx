import { useState } from 'react'
import './Calculator.css'
function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const handleNumber = (number) => {
    if (display === 'Error') {
      setDisplay(number)
      return
    }

    if (waitingForOperand) {
      setDisplay(number)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? number : display + number)
    }
  }

  const handleDecimal = () => {
    if (display === 'Error') {
      setDisplay('0.')
      return
    }

    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '*': return a * b
      case '/': return b === 0 ? 'Error' : a / b
      default: return b
    }
  }

  const handleOperator = (nextOperator) => {
    if (display === 'Error') return

    const inputValue = Number(display)

    if (operator && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operator)

      if (result === 'Error' || !Number.isFinite(result)) {
        setDisplay('Error')
        setPreviousValue(null)
        setOperator(null)
        setWaitingForOperand(true)
        return
      }

      setDisplay(String(Number(result.toPrecision(12))))
      setPreviousValue(result)
    } else {
      setPreviousValue(inputValue)
    }

    setOperator(nextOperator)
    setWaitingForOperand(true)
  }

  const handleEqual = () => {
    if (!operator || previousValue === null || waitingForOperand) return

    const result = calculate(
      previousValue,
      Number(display),
      operator
    )

    if (result === 'Error' || !Number.isFinite(result)) {
      setDisplay('Error')
    } else {
      setDisplay(String(Number(result.toPrecision(12))))
    }

    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const handleDelete = () => {
    if (display === 'Error' || waitingForOperand) {
      setDisplay('0')
      setWaitingForOperand(false)
      return
    }

    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  const buttons = [
    { label: 'AC', type: 'utility', action: handleClear },
    { label: 'DEL', type: 'utility', action: handleDelete },
    { label: '÷', type: 'operator', action: () => handleOperator('/') },
    { label: '×', type: 'operator', action: () => handleOperator('*') },

    { label: '7', type: 'number', action: () => handleNumber('7') },
    { label: '8', type: 'number', action: () => handleNumber('8') },
    { label: '9', type: 'number', action: () => handleNumber('9') },
    { label: '−', type: 'operator', action: () => handleOperator('-') },

    { label: '4', type: 'number', action: () => handleNumber('4') },
    { label: '5', type: 'number', action: () => handleNumber('5') },
    { label: '6', type: 'number', action: () => handleNumber('6') },
    { label: '+', type: 'operator', action: () => handleOperator('+') },

    { label: '1', type: 'number', action: () => handleNumber('1') },
    { label: '2', type: 'number', action: () => handleNumber('2') },
    { label: '3', type: 'number', action: () => handleNumber('3') },
    { label: '=', type: 'equal', action: handleEqual },

    { label: '%', type: 'utility', action: () => {
      if (display !== 'Error') {
        setDisplay(String(Number(display) / 100))
      }
    }},
    { label: '0', type: 'number', action: () => handleNumber('0') },
    { label: '.', type: 'number', action: handleDecimal },
  ]

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h2>Calculator</h2>
        <span>React Project</span>
      </div>

      <div className="display">
        <span className="expression">
          {previousValue !== null && operator
            ? `${previousValue} ${operator}`
            : ''}
        </span>

        <div className="display-value" title={display}>
          {display}
        </div>
      </div>

      <div className="buttons">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`btn ${button.type} ${
              operator && button.label ===
              ({ '+': '+', '-': '−', '*': '×', '/': '÷' }[operator])
                ? 'active'
                : ''
            }`}
            onClick={button.action}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calculator
