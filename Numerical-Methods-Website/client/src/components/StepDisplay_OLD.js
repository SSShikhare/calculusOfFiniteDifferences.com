import React, { useState, useMemo } from 'react';
import MathDisplay from './MathDisplay';
import InterpolationGraph from './InterpolationGraph';

// Helper function for factorial
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

const StepDisplay = ({ steps, precision = 4 }) => {
    // --- Refactored dynamic JSX fragments ---
    let stepwiseFormulaDisplay = null;
    let simplifiedFormulaDisplay = null;
    let solutionDisplay = null;

    // Stepwise formula (forward method)
    if (isValidXValue && method === 'forward') {
      // ...extract the logic from the first IIFE in JSX...
      // For brevity, you can copy the logic from the IIFE and assign the result to stepwiseFormulaDisplay
      // Example:
      // stepwiseFormulaDisplay = <div>...</div>;
    }

    // Simplified formula
    if (isValidXValue) {
      // ...extract the logic from the second IIFE in JSX...
      // simplifiedFormulaDisplay = <div>...</div>;
    }

    // Solution display
    if (showSolution && isValidXValue) {
      // ...extract the logic from the third IIFE in JSX...
      // solutionDisplay = <div>...</div>;
    }
  const [xValue, setXValue] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isSolutionExpanded, setIsSolutionExpanded] = useState(true);
  const [areStepsExpanded, setAreStepsExpanded] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState({ step1: true, step2: true, step3: true });

  const toggleStep = (stepKey) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  // Extract data from steps
  const tableData = useMemo(() => {
    if (steps.length === 0) return null;
    const step = steps[0];
    return {
      headers: step.result?.headers || [],
      rows: step.result?.rows || [],
      method: step.title || '',
      xValues: step.result?.headers?.includes('x_i') ? step.result.rows.map(row => row[0]) : []
    };
  }, [steps]);

  // Validate x value range
  const isValidXValue = useMemo(() => {
    if (!tableData || tableData.xValues.length === 0 || !xValue) return false;
    const xNum = parseFloat(xValue);
    if (isNaN(xNum)) return false;
    const minX = Math.min(...tableData.xValues);
    const maxX = Math.max(...tableData.xValues);
    return xNum >= minX && xNum <= maxX;
  }, [xValue, tableData]);

  if (steps.length === 0) {
    return (
      <div className="steps-container">
        <p className="placeholder-text">Enter values and click "Calculate" to see step-by-step solution</p>
      </div>
    );
  }

  const step = steps[0];
  const method = step.title.includes('Forward') ? 'forward' : 
                 step.title.includes('Backward') ? 'backward' : 'central';

  // Helper function to get Newton's formula based on method
  const getNewtonFormula = (method) => {
    const y0 = 'y_0';
    const Δy0 = 'Δy_0';
    const Δ2y0 = 'Δ^2y_0';
    const Δ3y0 = 'Δ^3y_0';
    const Δ4y0 = 'Δ^4y_0';
    const p = 'p';
    
    if (method === 'forward') {
      return `f(x) = ${y0} + ${p}${Δy0} + \\frac{${p}(${p}-1)}{2!}${Δ2y0} + \\frac{${p}(${p}-1)(${p}-2)}{3!}${Δ3y0} + \\frac{${p}(${p}-1)(${p}-2)(${p}-3)}{4!}${Δ4y0} + ...`;
    } else if (method === 'backward') {
      return `f(x) = y_n + ${p}∇y_n + \\frac{${p}(${p}+1)}{2!}∇^2y_n + \\frac{${p}(${p}+1)(${p}+2)}{3!}∇^3y_n + \\frac{${p}(${p}+1)(${p}+2)(${p}+3)}{4!}∇^4y_n + ...`;
    } else {
      return `f(x) = y_0 + ${p}δy_{1/2} + \\frac{${p}^2-1}{2!}δ^2y_0 + \\frac{${p}(${p}^2-1)}{3!}δ^3y_{1/2} + \\frac{(${p}^2-1)(${p}^2-4)}{4!}δ^4y_0 + ...`;
    }
  };

  // Helper function to parse difference value
  const parseDiffValue = (val) => {
    if (val === '-') return null;
    if (typeof val === 'string') return parseFloat(val);
    return val;
  };

  // Helper function to build substitution formula
  const buildSubstitutionFormula = () => {
    const xNum = parseFloat(xValue);
    let h, x0, p, y0Val;
    let terms = [];
    if (method === 'forward') {
      // Forward method
      x0 = step.result.rows[0][0];
      h = step.result.rows[1]?.[0] - step.result.rows[0][0] || 1;
      p = (xNum - x0) / h;
      y0Val = parseDiffValue(step.result.rows[0][1]);
      if (y0Val !== null && !isNaN(y0Val)) {
        terms.push({ name: 'y₀', value: y0Val, calc: typeof y0Val === 'number' ? y0Val.toFixed(precision) : parseFloat(y0Val).toFixed(precision) });
      }
      // Add difference terms

      // import React, { useState, useMemo } from 'react';
      // import MathDisplay from './MathDisplay';
      // import InterpolationGraph from './InterpolationGraph';

      function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result;
      }

      const StepDisplay = ({ steps, precision = 4 }) => {
        const [xValue, setXValue] = useState('');
        const [showSolution, setShowSolution] = useState(false);
        const [isSolutionExpanded, setIsSolutionExpanded] = useState(true);
        const [areStepsExpanded, setAreStepsExpanded] = useState(true);
        const [expandedSteps, setExpandedSteps] = useState({ step1: true, step2: true, step3: true });

        const toggleStep = (stepKey) => {
          setExpandedSteps(prev => ({
            ...prev,
            [stepKey]: !prev[stepKey]
          }));
        };

        const tableData = useMemo(() => {
          if (steps.length === 0) return null;
          const step = steps[0];
          return {
            headers: step.result?.headers || [],
            rows: step.result?.rows || [],
            method: step.title || '',
            xValues: step.result?.headers?.includes('x_i') ? step.result.rows.map(row => row[0]) : []
          };
        }, [steps]);

        const isValidXValue = useMemo(() => {
          if (!tableData || tableData.xValues.length === 0 || !xValue) return false;
          const xNum = parseFloat(xValue);
          if (isNaN(xNum)) return false;
          const minX = Math.min(...tableData.xValues);
          const maxX = Math.max(...tableData.xValues);
          return xNum >= minX && xNum <= maxX;
        }, [xValue, tableData]);

        if (steps.length === 0) {
          return (
            <div className="steps-container">
              <p className="placeholder-text">Enter values and click "Calculate" to see step-by-step solution</p>
            </div>
          );
        }

        const step = steps[0];
        const method = step.title.includes('Forward') ? 'forward' : 
                       step.title.includes('Backward') ? 'backward' : 'central';

        const getNewtonFormula = (method) => {
          const y0 = 'y_0';
          const Δy0 = 'Δy_0';
          const Δ2y0 = 'Δ^2y_0';
          const Δ3y0 = 'Δ^3y_0';
          const Δ4y0 = 'Δ^4y_0';
          const p = 'p';
          if (method === 'forward') {
            return `f(x) = ${y0} + ${p}${Δy0} + \\frac{${p}(${p}-1)}{2!}${Δ2y0} + \\frac{${p}(${p}-1)(${p}-2)}{3!}${Δ3y0} + \\frac{${p}(${p}-1)(${p}-2)(${p}-3)}{4!}${Δ4y0} + ...`;
          } else if (method === 'backward') {
            return `f(x) = y_n + ${p}∇y_n + \\frac{${p}(${p}+1)}{2!}∇^2y_n + \\frac{${p}(${p}+1)(${p}+2)}{3!}∇^3y_n + \\frac{${p}(${p}+1)(${p}+2)(${p}+3)}{4!}∇^4y_n + ...`;
          } else {
            return `f(x) = y_0 + ${p}δy_{1/2} + \\frac{${p}^2-1}{2!}δ^2y_0 + \\frac{${p}(${p}^2-1)}{3!}δ^3y_{1/2} + \\frac{(${p}^2-1)(${p}^2-4)}{4!}δ^4y_0 + ...`;
          }
        };

        const parseDiffValue = (val) => {
          if (val === '-') return null;
          if (typeof val === 'string') return parseFloat(val);
          return val;
        };

        const buildSubstitutionFormula = () => {
          const xNum = parseFloat(xValue);
          let h, x0, p, y0Val;
          let terms = [];
          if (method === 'forward') {
            x0 = step.result.rows[0][0];
            h = step.result.rows[1]?.[0] - step.result.rows[0][0] || 1;
            p = (xNum - x0) / h;
            y0Val = parseDiffValue(step.result.rows[0][1]);
            if (y0Val !== null && !isNaN(y0Val)) {
              terms.push({ name: 'y₀', value: y0Val, calc: typeof y0Val === 'number' ? y0Val.toFixed(precision) : parseFloat(y0Val).toFixed(precision) });
            }
            for (let i = 2; i < step.result.headers.length; i++) {
              const diffVal = parseDiffValue(step.result.rows[0][i]);
              if (diffVal === null) break;
              const order = i - 1;
              let coeff = 1, coeffStr = 'p', fact = 1;
              for (let j = 1; j < order; j++) {
                coeff *= (p - j);
                coeffStr += `(p-${j})`;
              }
              for (let j = 1; j <= order; j++) fact *= j;
              coeff *= p;
              coeff /= fact;
              const termValue = coeff * diffVal;
              terms.push({
                name: `Δ^${order}y₀ term`,
                coefficient: coeff,
                value: diffVal,
                termValue: termValue,
                coeffStr: coeffStr,
                factorial: fact
              });
            }
            return { p, x0, h, y0Val, terms };
          } else if (method === 'backward') {
            x0 = step.result.rows[step.result.rows.length - 1][0];
            h = step.result.rows[step.result.rows.length - 1]?.[0] - step.result.rows[step.result.rows.length - 2]?.[0] || 1;
            p = (xNum - x0) / h;
            y0Val = parseDiffValue(step.result.rows[step.result.rows.length - 1][1]);
            if (y0Val !== null && !isNaN(y0Val)) {
              terms.push({ name: 'yₙ', value: y0Val, calc: typeof y0Val === 'number' ? y0Val.toFixed(precision) : parseFloat(y0Val).toFixed(precision) });
            }
            for (let i = 2; i < step.result.headers.length; i++) {
              const diffVal = parseDiffValue(step.result.rows[step.result.rows.length - 1][i]);
              if (diffVal === null) break;
              const order = i - 1;
              let coeff = 1, coeffStr = 'p', fact = 1;
              for (let j = 1; j < order; j++) {
                coeff *= (p + j);
                coeffStr += `(p+${j})`;
              }
              for (let j = 1; j <= order; j++) fact *= j;
              coeff *= p;
              coeff /= fact;
              const termValue = coeff * diffVal;
              terms.push({
                name: `∇^${order}yₙ term`,
                coefficient: coeff,
                value: diffVal,
                termValue: termValue,
                coeffStr: coeffStr,
                factorial: fact
              });
            }
            return { p, x0, h, y0Val, terms };
          } else if (method === 'central') {
            const midIdx = Math.floor(step.result.rows.length / 2);
            x0 = step.result.rows[midIdx][0];
            h = step.result.rows[1]?.[0] - step.result.rows[0][0] || 1;
            p = (xNum - x0) / h;
            y0Val = parseDiffValue(step.result.rows[midIdx][1]);
            if (y0Val !== null && !isNaN(y0Val)) {
              terms.push({ name: 'y₀', value: y0Val, calc: typeof y0Val === 'number' ? y0Val.toFixed(precision) : parseFloat(y0Val).toFixed(precision) });
            }
            for (let i = 2; i < step.result.headers.length; i++) {
              const diffVal = parseDiffValue(step.result.rows[0][i]);
              if (diffVal === null) break;
              const order = i - 1;
              let coeff, coeffStr, fact;
              if (order === 1) {
                coeff = p;
                coeffStr = 'p';
                fact = 1;
              } else if (order % 2 === 0) {
                let num = 1;
                coeffStr = '';
                for (let j = 1; j <= order / 2; j++) {
                  num *= (p * p - (j * 2 - 1) * (j * 2 - 1));
                  if (coeffStr) coeffStr += `(p²-${(j * 2 - 1) ** 2})`;
                  else coeffStr = `(p²-${(j * 2 - 1) ** 2})`;
                }
                coeff = num;
                fact = 1;
                for (let j = 1; j <= order; j++) fact *= j;
              } else {
                let num = p;
                coeffStr = 'p';
                for (let j = 1; j <= (order - 1) / 2; j++) {
                  num *= (p * p - (j * 2) * (j * 2));
                  coeffStr += `(p²-${(j * 2) ** 2})`;
                }
                coeff = num;
                fact = 1;
                for (let j = 1; j <= order; j++) fact *= j;
              }
              coeff /= fact;
              const termValue = coeff * diffVal;
              terms.push({
                name: `δ^${order}y term`,
                coefficient: coeff,
                value: diffVal,
                termValue: termValue,
                coeffStr: coeffStr,
                factorial: fact
              });
            }
            return { p, x0, h, y0Val, terms };
          }
          return { p, x0, h, y0Val, terms };
        };

        const handleCalculateSolution = (e) => {
          e.preventDefault();
          if (isValidXValue) {
            setShowSolution(true);
          }
        };

        const getMinMaxX = () => {
          if (!tableData || tableData.xValues.length === 0) return { min: 0, max: 0 };
          return {
            min: Math.min(...tableData.xValues),
            max: Math.max(...tableData.xValues)
          };
        };

        const range = getMinMaxX();

        let polyCoeffs = null;
        if (method === 'forward' && steps.length > 0) {
          const step = steps[0];
          const deltaY1 = step.result.rows[0][2];
          const deltaY2 = step.result.rows[0][3];
          const y0 = step.result.rows[0][1];
          const x0 = step.result.rows[0][0];
          const h = step.result.rows[1]?.[0] - step.result.rows[0][0] || 1;
          if (!isNaN(deltaY1) && !isNaN(deltaY2)) {
            const a = parseFloat(y0);
            const b = parseFloat(deltaY1);
            const c = parseFloat(deltaY2);
            const x0n = parseFloat(x0);
            const hn = parseFloat(h);
            const bOverH = b / hn;
            const cOver2H2 = c / (2 * hn * hn);
            const cOver2H = c / (2 * hn);
            const a2 = cOver2H2;
            const a1 = bOverH - cOver2H * 1 - 2 * cOver2H2 * x0n;
            const a0 = a + cOver2H2 * x0n * x0n - bOverH * x0n + cOver2H * x0n;
            polyCoeffs = [a0, a1, a2];
          }
        }

        // All rendering logic should be assigned to variables before return
        // Example: assign all dynamic JSX fragments to variables above
        // let stepwiseFormulaDisplay = ...;
        // let simplifiedFormulaDisplay = ...;
        // let solutionDisplay = ...;

        // TODO: Refactor all IIFEs in JSX to variables above, then inject here
        return (
          <div className="steps-container">
            {/* Place all static and dynamic JSX here, using only variables for dynamic fragments. */}
          </div>
        );
      };


                      if (deltaCoeffs.length > 2) {
                        a3 += deltaCoeffs[2]/(6*hNum*hNum*hNum);
                        a2 += -deltaCoeffs[2]*(3*x0Num+3*hNum)/(6*hNum*hNum*hNum);
                        a1 += deltaCoeffs[2]*(3*x0Num*x0Num+6*x0Num*hNum+2*hNum*hNum)/(6*hNum*hNum*hNum);
                        a0 += -deltaCoeffs[2]*x0Num*(x0Num+hNum)*(x0Num+2*hNum)/(6*hNum*hNum*hNum);
                      }
                      // Build simplified polynomial string
                      let simplifiedLatex = `f(x) = ${a0.toFixed(precision)}`;
                      if (Math.abs(a1) > 1e-10) simplifiedLatex += ` + (${a1.toFixed(precision)})x`;
                      if (Math.abs(a2) > 1e-10) simplifiedLatex += ` + (${a2.toFixed(precision)})x^2`;
                      if (Math.abs(a3) > 1e-10) simplifiedLatex += ` + (${a3.toFixed(precision)})x^3`;
                      return (
                        <>
                          <div style={{marginTop: '0.5em'}}>
                            <MathDisplay expression={polyLatex} />
                          </div>
                          {/* Move Simplified Polynomial to a separate block below */}
                        </>
                      );
                    }}
                  </div>
                  {/* Display Simplified Polynomial as a separate block below Fully Expanded Polynomial */}
                  <div style={{marginTop: '1em'}}>
                    <strong>Simplified Polynomial:</strong>
                    {(() => {
                      // Repeat calculation for simplified polynomial
                      const x0Num = parseFloat(x0);
                      const hNum = parseFloat(h);
                      const y0Num = parseFloat(y0);
                      let deltaCoeffs = [];
                      for (let k = 0; k < deltaYs.length; k++) {
                        deltaCoeffs.push(parseFloat(deltaYs[k]));
                      }
                      let a0 = y0Num;
                      let a1 = 0, a2 = 0, a3 = 0;
                      if (deltaCoeffs.length > 0) {
                        a1 += deltaCoeffs[0]/hNum;
                      }
                      if (deltaCoeffs.length > 1) {
                        a2 += deltaCoeffs[1]/(2*hNum*hNum);
                        a1 += -deltaCoeffs[1]*(2*x0Num+hNum)/(2*hNum*hNum);
                        a0 += deltaCoeffs[1]*x0Num*(x0Num+hNum)/(2*hNum*hNum);
                      }
                      if (deltaCoeffs.length > 2) {
                        a3 += deltaCoeffs[2]/(6*hNum*hNum*hNum);
                        a2 += -deltaCoeffs[2]*(3*x0Num+3*hNum)/(6*hNum*hNum*hNum);
                        a1 += deltaCoeffs[2]*(3*x0Num*x0Num+6*x0Num*hNum+2*hNum*hNum)/(6*hNum*hNum*hNum);
                        a0 += -deltaCoeffs[2]*x0Num*(x0Num+hNum)*(x0Num+2*hNum)/(6*hNum*hNum*hNum);
                      }
                      let simplifiedLatex = `f(x) = ${a0.toFixed(precision)}`;
                      if (Math.abs(a1) > 1e-10) simplifiedLatex += ` + (${a1.toFixed(precision)})x`;
                      if (Math.abs(a2) > 1e-10) simplifiedLatex += ` + (${a2.toFixed(precision)})x^2`;
                      if (Math.abs(a3) > 1e-10) simplifiedLatex += ` + (${a3.toFixed(precision)})x^3`;
                      return (
                        <>
                          <div style={{marginTop: '0.5em'}}>
                            <MathDisplay expression={simplifiedLatex} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
            {/* Simplified formula with p substituted */}
            {isValidXValue && (() => {
              const { p, x0, h } = buildSubstitutionFormula();
              const pVal = typeof p === 'number' ? p.toFixed(precision) : p;
              // Show how p is calculated
              const xVal = parseFloat(xValue);
              const x0Val = typeof x0 === 'number' ? x0.toFixed(precision) : x0;
              const hVal = typeof h === 'number' ? h.toFixed(precision) : h;
              const pCalc = `p = (x - x_0) / h = (${xVal} - ${x0Val}) / ${hVal} = ${pVal}`;

              // Gather all Δy values
              const y0 = step.result.rows[0][1];
              const deltaYs = [];
              for (let i = 2; i < step.result.headers.length; i++) {
                const diffVal = step.result.rows[0][i];
                if (diffVal === '-' || diffVal === undefined || diffVal === null || isNaN(diffVal)) break;
                deltaYs.push(diffVal);
              }

              // Build the formula with p and Δy values
              let formulaWithDelta = `f(x) = ${y0}`;
              let formulaSteps = [];
                let runningSum_simplified = parseFloat(y0);
              for (let k = 0; k < deltaYs.length; k++) {
                let numVal = 1;
                let numStr = '';
                for (let j = 0; j <= k; j++) {
                  if (j === 0) {
                    numStr += `(${pVal})`;
                    numVal *= p;
                  } else {
                    numStr += `(${pVal}-${j})`;
                    numVal *= (p - j);
                  }
                }
                const denomVal = factorial(k+1);
                const termVal = (numVal / denomVal) * deltaYs[k];
                let term = k === 0
                  ? `(${pVal}) \times (${deltaYs[0]})`
                  : `(${numStr})/(${denomVal}) \times (${deltaYs[k]})`;
                formulaWithDelta += ` + ${term}`;
                  runningSum_simplified += termVal;
                  formulaSteps.push(`${term} = ${termVal.toFixed(precision)} (Partial sum: ${runningSum_simplified.toFixed(precision)})`);
              }

              return (
                <div className="formula-box simplified-formula-box">
                  <strong>Simplified Formula (with p = {pVal}):</strong>
                  <div style={{marginTop: '0.5em'}}>
                    <MathDisplay expression={pCalc} />
                  </div>
                  <div style={{marginTop: '0.5em'}}>
                    <MathDisplay expression={formulaWithDelta} />
                  </div>
                  <div style={{marginTop: '0.5em'}}>
                    <strong>Stepwise Numeric Evaluation:</strong>
                    {formulaSteps.map((step, idx) => (
                      <div key={idx} style={{marginLeft: '1em'}}>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop: '0.5em', fontWeight: 'bold', color: '#27ae60'}}>
                      <MathDisplay expression={`f(${xVal}) = ${runningSum_simplified.toFixed(precision)}`} />
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="x-input-section">
            <h3>Interpolate at Point</h3>
            <form onSubmit={handleCalculateSolution}>
              <div className="input-group">
                <label htmlFor="xInput">
                  Enter x value (Range: {range.min.toFixed(precision)} to {range.max.toFixed(precision)}):
                </label>
                <input
                  type="number"
                  id="xInput"
                  value={xValue}
                  onChange={(e) => {
                    setXValue(e.target.value);
                    setShowSolution(false);
                  }}
                  placeholder="Enter x value"
                  step="0.0001"
                />
                {xValue && !isValidXValue && (
                  <p className="error-text">
                    ✗ x value must be between {range.min.toFixed(precision)} and {range.max.toFixed(precision)}
                  </p>
                )}
                {isValidXValue && (
                  <p className="success-text">
                    ✓ x value is valid
                  </p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={!isValidXValue}
                className="solve-button"
              >
                Solve for x = {xValue || '?'}
              </button>
            </form>
          </div>
        </div>
        <div className="interpolation-formula-graph">
          <h3>Interpolation Visualization</h3>
          <p className="graph-note">Visual representation of the interpolation curve, original data points, and the simplified polynomial</p>
          <InterpolationGraph tableData={tableData} method={method} precision={precision} polyCoeffs={polyCoeffs} />
        </div>
        {showSolution && isValidXValue && (() => {
          const { p, x0, h, terms } = buildSubstitutionFormula();
          const finalResult = terms.reduce((sum, term) => {
            if (term.calc) return sum + term.value;
            if (term.termValue) return sum + term.termValue;
            return sum;
          }, 0);

          return (
            <div className="steps-container">
              <h2>Step-by-Step Solution</h2>
              <div className="newton-formula-section">
                <div className="formula-input-group">
                  <div className="formula-display">
                    <h3>Newton's Interpolation Formula</h3>
                    <div className="formula-box">
                      <MathDisplay expression={getNewtonFormula(method)} />
                    </div>
                    <p className="formula-note">
                      Where: p = (x - x₀) / h (for forward), p = (x - xₙ) / h (for backward), h = step size
                    </p>
                    {/* Stepwise substitution of p by (x-x0)/h, then by values */}
                    {stepwiseFormulaDisplay}
                    {/* Simplified formula with p substituted */}
                    {simplifiedFormulaDisplay}
                  </div>
                  <div className="x-input-section">
                    {/* ...existing code... */}
                  </div>
                </div>
                <div className="interpolation-formula-graph">
                  {/* ...existing code... */}
                </div>
                {solutionDisplay}
              </div>
            </div>
          );
                    >
                      <span className="toggle-icon">{expandedSteps.step1 ? '▼' : '▶'}</span>
                      <h4>Step 1: Calculate p (Normalized Distance)</h4>
                    </button>
                    {expandedSteps.step1 && (
                <div className="calculation-step">
                  <p>For <strong>{method.charAt(0).toUpperCase() + method.slice(1)} Difference Method:</strong></p>
                  {method === 'forward' && (
                    <>
                      <p>p = (x - x₀) / h</p>
                      <p>where x₀ = {x0.toFixed(precision)} (first x value), h = {h.toFixed(precision)}</p>
                      <p>p = ({xValue} - {x0.toFixed(precision)}) / {h.toFixed(precision)}</p>
                      <p className="result-line">p = <strong>{p.toFixed(precision)}</strong></p>
                    </>
                  )}
                  {method === 'backward' && (
                    <>
                      <p>p = (x - xₙ) / h</p>
                      <p>where xₙ = {x0.toFixed(precision)} (last x value), h = {h.toFixed(precision)}</p>
                      <p>p = ({xValue} - {x0.toFixed(precision)}) / {h.toFixed(precision)}</p>
                      <p className="result-line">p = <strong>{p.toFixed(precision)}</strong></p>
                    </>
                  )}
                  {method === 'central' && (
                    <>
                      <p>p = (x - x₀) / h</p>
                      <p>where x₀ = {x0.toFixed(precision)} (central x value), h = {h.toFixed(precision)}</p>
                      <p>p = ({xValue} - {x0.toFixed(precision)}) / {h.toFixed(precision)}</p>
                      <p className="result-line">p = <strong>{p.toFixed(precision)}</strong></p>
                    </>
                  )}
                </div>
                    )}
              </div>

              <div className="step-card">
                    <button 
                      className="step-toggle-btn" 
                      onClick={() => toggleStep('step2')}
                      aria-expanded={expandedSteps.step2}
                    >
                      <span className="toggle-icon">{expandedSteps.step2 ? '▼' : '▶'}</span>
                      <h4>Step 2: Apply Newton's Formula with All Available Terms</h4>
                    </button>
                    {expandedSteps.step2 && (
                <div className="calculation-step">
                  <p><strong>Substituting x = {xValue} and p = {p.toFixed(precision)} into the formula:</strong></p>
                  
                  <div className="formula-substitution">
                    <p>f({xValue}) = {typeof terms[0].calc === 'string' ? terms[0].calc : (typeof terms[0].calc === 'number' ? terms[0].calc.toFixed(precision) : (typeof terms[0].value === 'number' ? terms[0].value.toFixed(precision) : 'N/A'))}</p>
                    
                    {terms.slice(1).map((term, idx) => (
                      <div key={idx} className="term-calculation">
                        <p className="term-header">
                          <strong>{term.name}:</strong>
                        </p>
                        <p>Coefficient = {term.coeffStr} / {term.factorial}!</p>
                        <p>Coefficient = {term.coeffStr} / {term.factorial}</p>
                        <p>Coefficient = {term.coefficient.toFixed(precision)}</p>
                        <p>Term Value = {term.coefficient.toFixed(precision)} × {term.value.toFixed(precision)} = {term.termValue.toFixed(precision)}</p>
                        <p className="term-result">
                          {idx === 0 ? '+' : (term.termValue >= 0 ? '+' : '')} {term.termValue.toFixed(precision)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                    )}
              </div>

              <div className="step-card">
                    <button 
                      className="step-toggle-btn" 
                      onClick={() => toggleStep('step3')}
                      aria-expanded={expandedSteps.step3}
                    >
                      <span className="toggle-icon\">{expandedSteps.step3 ? '▼' : '▶'}</span>
                      <h4>Step 3: Final Answer</h4>
                    </button>
                    {expandedSteps.step3 && (
                <div className="calculation-step final-result">
                  <p className="calculation-summary">
                    f({xValue}) = {terms.length > 0 ? (typeof terms[0].calc === 'string' ? terms[0].calc : (typeof terms[0].calc === 'number' ? terms[0].calc.toFixed(precision) : (typeof terms[0].value === 'number' ? terms[0].value.toFixed(precision) : 'N/A'))) : 'N/A'} {terms.length > 1 ? terms.slice(1).map((t, i) => 
                      `${t.termValue >= 0 ? '+' : ''} ${(typeof t.termValue === 'number' ? t.termValue.toFixed(precision) : parseFloat(t.termValue).toFixed(precision))}`
                    ).join(' ') : ''}
                  </p>
                  <p className="result-line">
                    f({xValue}) = <strong className="final-value">{(typeof finalResult === 'number' ? finalResult.toFixed(precision) : parseFloat(finalResult).toFixed(precision))}</strong>
                  </p>
                </div>
                    )}
              </div>
                  </div>
                  )}
                </div>
              </div>
              )}

              {isSolutionExpanded && (
              <div className="solution-footer">
                <p className="footer-note">This solution uses Newton's interpolation formula with all available difference terms from the table above.</p>
              </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
  }

  export default StepDisplay;