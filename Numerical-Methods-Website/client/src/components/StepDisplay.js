
import React from 'react';
import { simplify, parse } from 'mathjs';
import PropTypes from 'prop-types';
import MathDisplay from './MathDisplay';
import ChartDisplay from './ChartDisplay';
import ExpandedPolynomialDisplay from './ExpandedPolynomialDisplay';
import DifferenceTable from './DifferenceTable';

// StepDisplay component: displays step-by-step solution for interpolation or difference table problems

// Helper to get Newton's formula by method

// Helper to get Newton's formula by method (symbolic)
const getNewtonFormula = (method) => {
  const y0 = 'y_0';
  const Δy0 = 'Δy_0';
  const Δ2y0 = 'Δ^2y_0';
  const Δ3y0 = 'Δ^3y_0';
  const Δ4y0 = 'Δ^4y_0';
  const p = 'p';
  if (method === 'forward') {
    return `f(x) = ${y0} + ${p}${Δy0} + \\frac{${p}(${p}-1)}{2!}${Δ2y0} + \\frac{${p}(${p}-1)(${p}-2)}{3!}${Δ3y0} + \\frac{${p}(${p}-1)(${p}-2)(${p}-3)}{4!}${Δ4y0}`;
  } else if (method === 'backward') {
    return `f(x) = y_n + ${p}∇y_n + \\frac{${p}(${p}+1)}{2!}∇^2y_n + \\frac{${p}(${p}+1)(${p}+2)}{3!}∇^3y_n + \\frac{${p}(${p}+1)(${p}+2)(${p}+3)}{4!}∇^4y_n`;
  } else {
    return `f(x) = y_0 + ${p}δy_{1/2} + \\frac{${p}^2-1}{2!}δ^2y_0 + \\frac{${p}(${p}^2-1)}{3!}δ^3y_{1/2} + \\frac{(${p}^2-1)(${p}^2-4)}{4!}δ^4y_0`;
  }
};

// Helper to substitute p and delta values
const getSubstitutedFormula = (method, x0, h, x, deltas) => {
  // Only forward method for now, can extend for others
  if (method === 'forward') {
    const pExpr = `(x-${x0})/${h}`;
    let eq = `f(x) = ${deltas[0]}`;
    if (deltas.length > 1) eq += ` + (${pExpr})*${deltas[1]}`;
    if (deltas.length > 2) eq += ` + ((${pExpr})*(${pExpr}-1)/2)*${deltas[2]}`;
    if (deltas.length > 3) eq += ` + ((${pExpr})*(${pExpr}-1)*(${pExpr}-2)/6)*${deltas[3]}`;
    if (deltas.length > 4) eq += ` + ((${pExpr})*(${pExpr}-1)*(${pExpr}-2)*(${pExpr}-3)/24)*${deltas[4]}`;
    return eq;
  }
  // Add backward/central as needed
  return '';
};


const StepDisplay = ({ steps, currentStep, data, polynomial, table, chartData, method }) => {
  if (!steps || steps.length === 0) {
    return <div>No steps to display.</div>;
  }

  const step = steps[currentStep] || {};

  // Try to get x0, h, and delta values from step or table
  let x0 = null, h = null, deltas = [];
  if (table && table.length > 1 && table[0].length > 1) {
    x0 = table[0][0];
    if (table.length > 1) h = table[1][0] - table[0][0];
    for (let i = 0; i < Math.min(5, table[0].length); i++) {
      let val = table[0][i+1];
      if (typeof val === 'number' && isNaN(val)) val = 0;
      deltas.push(val);
    }
  }

  // Always show symbolic formula, show substitutions only if table data is available
  let formulaSteps = [getNewtonFormula(method)];
  let mathjsError = null;
  if (x0 !== null && h !== null && deltas.length > 0) {
    if (method === 'forward') {
      const pExpr = `(x-${x0})/${h}`;
      // Step 2: Substitute p, keep deltas symbolic
      let eq = `f(x) = ${deltas[0] !== undefined ? 'y_0' : '0'}`;
      eq += ` + (${pExpr})*${deltas.length > 1 ? 'Δy_0' : '0'}`;
      eq += ` + ((${pExpr})*(${pExpr}-1)/2)*${deltas.length > 2 ? 'Δ^2y_0' : '0'}`;
      eq += ` + ((${pExpr})*(${pExpr}-1)*(${pExpr}-2)/6)*${deltas.length > 3 ? 'Δ^3y_0' : '0'}`;
      eq += ` + ((${pExpr})*(${pExpr}-1)*(${pExpr}-2)*(${pExpr}-3)/24)*${deltas.length > 4 ? 'Δ^4y_0' : '0'}`;
      formulaSteps.push(eq);
      // Step 3: Substitute delta values, keep f(x)
      let eq2 = `f(x) = ${deltas[0] !== undefined ? deltas[0] : '0'}`;
      eq2 += ` + p*${deltas[1] !== undefined ? deltas[1] : '0'}`;
      eq2 += ` + (p*(p-1)/2)*${deltas[2] !== undefined ? deltas[2] : '0'}`;
      eq2 += ` + (p*(p-1)*(p-2)/6)*${deltas[3] !== undefined ? deltas[3] : '0'}`;
      eq2 += ` + (p*(p-1)*(p-2)*(p-3)/24)*${deltas[4] !== undefined ? deltas[4] : '0'}`;
      formulaSteps.push(eq2);
      // Step 4: Substitute p = (x-x0)/h into the numeric formula
      let eq3 = `${deltas[0] !== undefined ? deltas[0] : '0'}`;
      eq3 += ` + (${pExpr})*${deltas[1] !== undefined ? deltas[1] : '0'}`;
      eq3 += ` + ((${pExpr})*(${pExpr}-1)/2)*${deltas[2] !== undefined ? deltas[2] : '0'}`;
      eq3 += ` + ((${pExpr})*(${pExpr}-1)*(${pExpr}-2)/6)*${deltas[3] !== undefined ? deltas[3] : '0'}`;
      eq3 += ` + ((${pExpr})*(${pExpr}-1)*(${pExpr}-2)*(${pExpr}-3)/24)*${deltas[4] !== undefined ? deltas[4] : '0'}`;
      formulaSteps.push(`f(x) = ${eq3}`);
      // Step 5: Expand and simplify using mathjs
      try {
        // Remove f(x) = for mathjs parsing
        const expr = eq3.replace(/f\(x\)\s*=\s*/, '');
        const expanded = simplify(parse(expr).expand()).toString();
        formulaSteps.push(`f(x) = ${expanded}`);
      } catch (e) {
        mathjsError = e.message || 'MathJS expansion failed.';
      }
    }
    // Add backward/central as needed
  }

  return (
    <div className="step-display">
      <h2>Step {currentStep + 1} of {steps.length}</h2>
      {step.title && <h3>{step.title}</h3>}
      {step.description && <p>{step.description}</p>}
      {/* Newton's formula for the respective method */}
      <div className="newton-formula-section">
        <h4>Newton's Interpolation Formula ({method.charAt(0).toUpperCase() + method.slice(1)})</h4>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
          {formulaSteps.map((expr, idx) => (
            <MathDisplay key={idx} expression={expr} style={{marginTop: idx === 0 ? 0 : '-0.5em'}} />
          ))}
          {typeof mathjsError === 'string' && (
            <div style={{color:'red',marginTop:'0.5em'}}>Error simplifying polynomial: {mathjsError}</div>
          )}
        </div>
        <p style={{fontSize:'0.9em',color:'#666'}}>Where: p = (x - x₀) / h (forward), p = (x - xₙ) / h (backward), h = step size</p>
      </div>
      {step.math && <MathDisplay expression={step.math} />}
      {step.table && table && <DifferenceTable table={table} />}
      {step.polynomial && polynomial && <ExpandedPolynomialDisplay polynomial={polynomial} />}
      {step.chart && chartData && <ChartDisplay data={chartData} />}
      {step.extra && <div className="step-extra">{step.extra}</div>}
    </div>
  );
};

StepDisplay.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    math: PropTypes.string,
    table: PropTypes.bool,
    polynomial: PropTypes.bool,
    chart: PropTypes.bool,
    extra: PropTypes.node,
  })).isRequired,
  currentStep: PropTypes.number.isRequired,
  data: PropTypes.array,
  polynomial: PropTypes.string,
  table: PropTypes.array,
  chartData: PropTypes.object,
  method: PropTypes.string,
};

export default StepDisplay;
