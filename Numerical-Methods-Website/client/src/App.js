import React, { useState } from 'react';
import Calculator from './components/Calculator';
import StepDisplay from './components/StepDisplay';
import './styles/main.scss';


function App() {
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [precision, setPrecision] = useState(4);
  const [currentStep, setCurrentStep] = useState(0);
  const [method, setMethod] = useState('forward');

  const handleCalculate = async (inputData) => {
    if (inputData.method) setMethod(inputData.method);
    setIsLoading(true);
    setError('');
    try {
      if (!inputData.xValues || !inputData.yValues) {
        setError('Missing X or Y values');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Calculation failed');
      }
      
      const result = await response.json();
      if (!result.steps || !Array.isArray(result.steps)) {
        throw new Error('Invalid response from server');
      }
      setSteps(result.steps);
      setCurrentStep(0); // Reset to first step on new calculation
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Calculus of Finite Differences</h1>
        <p>Step-by-step solutions with mathematical notation and visualizations</p>
      </header>
      
      <main className="app-main">
        <Calculator onCalculate={handleCalculate} isLoading={isLoading} onPrecisionChange={setPrecision} method={method} setMethod={setMethod} />
        {error && <div className="error-message">{error}</div>}
        <StepDisplay steps={steps} currentStep={currentStep} precision={precision} method={method} />
      </main>
      
      <footer className="app-footer">
        <p>© 2025 Finite Differences Calculator | MERN Stack Application</p>
      </footer>
    </div>
  );
}

export default App;