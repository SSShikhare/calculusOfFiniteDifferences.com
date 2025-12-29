// client/src/components/Calculator.js
import React, { useState, useMemo } from 'react';
import DifferenceTable from './DifferenceTable';

const Calculator = ({ onCalculate, isLoading, onPrecisionChange, method, setMethod }) => {
  const [xValues, setXValues] = useState('');
  const [yValues, setYValues] = useState('');
  const [order, setOrder] = useState(1);
  const [precision, setPrecision] = useState(4);

  // Helper function to calculate step size and detect spacing
  const calculateStepSize = (xVals) => {
    if (xVals.length < 2) return { stepSize: null, isEvenly: false };

    const differences = [];
    for (let i = 1; i < xVals.length; i++) {
      differences.push(xVals[i] - xVals[i - 1]);
    }

    // Check if all differences are approximately equal (evenly spaced)
    const tolerance = 1e-10;
    const firstDiff = differences[0];
    const isEvenly = differences.every(diff => Math.abs(diff - firstDiff) < tolerance);

    return {
      stepSize: firstDiff,
      isEvenly,
      allDifferences: differences
    };
  };

  // Helper function to build forward difference table
  const buildForwardDifferenceTable = (xVals, yVals, maxOrder) => {
    const n = yVals.length;
    if (n < 2) return null;

    // Calculate forward differences
    const differences = [yVals.map((y, i) => ({ value: y, index: i }))];

    let lastDiff = maxOrder;
    for (let diff = 1; diff <= maxOrder && diff < n; diff++) {
      const nextDiff = [];
      const prevDiff = differences[diff - 1];

      for (let i = 0; i < prevDiff.length - 1; i++) {
        nextDiff.push({
          value: prevDiff[i + 1].value - prevDiff[i].value,
          index: i
        });
      }

      differences.push(nextDiff);
      lastDiff = diff;

      if (nextDiff.length <= 1) break;
    }

    // Build display table only for the final difference level
    const displayRows = [];
    for (let i = 0; i < n; i++) {
      const row = [xVals[i], yVals[i]];
      for (let d = 1; d <= lastDiff && d < differences.length; d++) {
        if (i < differences[d].length) {
          row.push(differences[d][i].value);
        } else {
          row.push(0);
        }
      }
      displayRows.push(row);
    }

    const headers = ['x_i', 'y_i'];
    for (let d = 1; d <= lastDiff; d++) {
      headers.push(`Δ^${d}y_i`);
    }

    return { headers, rows: displayRows };
  };

  // Helper function to build backward difference table
  const buildBackwardDifferenceTable = (xVals, yVals, maxOrder) => {
    const n = yVals.length;
    if (n < 2) return null;

    // Calculate backward differences using formula: ∇y_i = y_i - y_{i-1}
    const differences = [yVals.map((y, i) => ({ value: y, index: i }))];

    let lastDiff = maxOrder;
    for (let diff = 1; diff <= maxOrder && diff < n; diff++) {
      const nextDiff = [];
      const prevDiff = differences[diff - 1];

      // Calculate backward differences: ∇y_i = y_i - y_{i-1}
      for (let i = 1; i < prevDiff.length; i++) {
        nextDiff.push({
          value: prevDiff[i].value - prevDiff[i - 1].value,
          index: i
        });
      }

      differences.push(nextDiff);
      lastDiff = diff;

      if (nextDiff.length <= 1) break;
    }

    // Build display table only for the final difference level
    // Backward differences are positioned from right to left starting from bottom rows
    const displayRows = [];
    for (let i = 0; i < n; i++) {
      const row = [xVals[i], yVals[i]];
      for (let d = 1; d <= lastDiff && d < differences.length; d++) {
        // Position backward differences: only show if we have enough rows below
        if (i >= d - 1 && (i - d) >= 0 && (i - d) < differences[d].length) {
          row.push(differences[d][i - d].value);
        } else {
          row.push(0);
        }
      }
      displayRows.push(row);
    }

    const headers = ['x_i', 'y_i'];
    for (let d = 1; d <= lastDiff; d++) {
      headers.push(`∇^${d}y_i`);
    }

    return { headers, rows: displayRows };
  };

  // Helper function to build central difference table
  const buildCentralDifferenceTable = (xVals, yVals, maxOrder) => {
    const n = yVals.length;
    if (n < 2) return null;

    // Calculate central differences using formula: δy_{i+1/2} = y_{i+1} - y_i
    const differences = [yVals.map((y, i) => ({ value: y, index: i }))];

    let lastDiff = maxOrder;
    for (let diff = 1; diff <= maxOrder && diff < n; diff++) {
      const nextDiff = [];
      const prevDiff = differences[diff - 1];

      // Central differences: δy_{i+1/2} = y_{i+1} - y_i
      for (let i = 0; i < prevDiff.length - 1; i++) {
        nextDiff.push({
          value: prevDiff[i + 1].value - prevDiff[i].value,
          index: i
        });
      }

      differences.push(nextDiff);
      lastDiff = diff;

      if (nextDiff.length <= 1) break;
    }

    // Build display table only for the final difference level
    const displayRows = [];
    for (let i = 0; i < n; i++) {
      const row = [xVals[i], yVals[i]];
      for (let d = 1; d <= lastDiff && d < differences.length; d++) {
        // Position central differences
        if (i < differences[d].length) {
          row.push(differences[d][i].value);
        } else {
          row.push(0);
        }
      }
      displayRows.push(row);
    }

    const headers = ['x_i', 'y_i'];
    for (let d = 1; d <= lastDiff; d++) {
      headers.push(`δ^${d}y_{i+1/2}`);
    }

    return { headers, rows: displayRows };
  };

  // Compute step size info and preview table based on current inputs
  const { previewTable, stepSizeInfo } = useMemo(() => {
    if (!xValues.trim() || !yValues.trim()) {
      return { previewTable: null, stepSizeInfo: null };
    }

    const parsedXValues = xValues.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    const parsedYValues = yValues.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));

    if (parsedXValues.length < 2 || parsedYValues.length < 2 || parsedXValues.length !== parsedYValues.length) {
      return { previewTable: null, stepSizeInfo: null };
    }

    // Calculate step size
    const stepInfo = calculateStepSize(parsedXValues);

    const parsedOrder = Math.min(parseInt(order) || 1, parsedXValues.length - 1);

    let table = null;
    if (method === 'forward') {
      table = buildForwardDifferenceTable(parsedXValues, parsedYValues, parsedOrder);
    } else if (method === 'backward') {
      table = buildBackwardDifferenceTable(parsedXValues, parsedYValues, parsedOrder);
    } else if (method === 'central') {
      table = buildCentralDifferenceTable(parsedXValues, parsedYValues, parsedOrder);
    }

    return { previewTable: table, stepSizeInfo: stepInfo };
  }, [xValues, yValues, method, order]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!xValues.trim()) {
      alert('Please enter X values');
      return;
    }
    
    if (!yValues.trim()) {
      alert('Please enter Y values');
      return;
    }
    
    // Parse X values (comma-separated numbers)
    const parsedXValues = xValues.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    if (parsedXValues.length < 2) {
      alert('Please enter at least 2 valid X values separated by commas');
      return;
    }
    
    // Parse Y values (comma-separated numbers)
    const parsedYValues = yValues.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    if (parsedYValues.length < 2) {
      alert('Please enter at least 2 valid Y values separated by commas');
      return;
    }
    
    // Check if X and Y arrays have same length
    if (parsedXValues.length !== parsedYValues.length) {
      alert('X and Y values must have the same number of elements');
      return;
    }
    
    const parsedOrder = parseInt(order);
    if (isNaN(parsedOrder) || parsedOrder < 1 || parsedOrder > 5) {
      alert('Order must be between 1 and 5');
      return;
    }

    // Calculate step size
    const stepInfo = calculateStepSize(parsedXValues);
    
    onCalculate({
      xValues: parsedXValues,
      yValues: parsedYValues,
      method,
      stepSize: stepInfo.stepSize,
      order: parsedOrder
    });
  };

  return (
    <div className="calculator-card">
      <h2>Input Parameters</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="xValues">X Values (x₀, x₁, x₂, ...):</label>
          <input
            type="text"
            id="xValues"
            value={xValues}
            onChange={(e) => setXValues(e.target.value)}
            placeholder="e.g., 0, 1, 2, 3, 4"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="yValues">Y Values (y₀, y₁, y₂, ...):</label>
          <input
            type="text"
            id="yValues"
            value={yValues}
            onChange={(e) => setYValues(e.target.value)}
            placeholder="e.g., 1, 3, 7, 13, 21"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="method">Difference Method:</label>
          <select id="method" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="forward">Newton's Forward Difference</option>
            <option value="backward">Newton's Backward Difference</option>
            <option value="central">Central Difference</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="order">Order of Difference:</label>
          <input
            type="number"
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        
        <div className="form-group" id="precision-group">
          <label htmlFor="precision">Decimal Places (Precision):</label>
          <select 
            id="precision" 
            value={precision} 
            onChange={(e) => {
              const newPrecision = parseInt(e.target.value);
              setPrecision(newPrecision);
              if (onPrecisionChange) onPrecisionChange(newPrecision);
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
              <option key={p} value={p}>{p} decimal place{p !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        
        {stepSizeInfo && (
          <div className="step-size-display">
            <h4>Step Size Information</h4>
            <div className="step-size-content">
              <div className="step-size-value">
                <span className="label">h =</span>
                <span className="value">{stepSizeInfo.stepSize.toFixed(precision)}</span>
              </div>
              <div className={`spacing-status ${stepSizeInfo.isEvenly ? 'evenly-spaced' : 'unevenly-spaced'}`}>
                <span className="status-icon">●</span>
                <span className="status-text">
                  {stepSizeInfo.isEvenly ? 'Evenly Spaced' : 'Unevenly Spaced'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {previewTable && (
        <div className="preview-section">
          <h3>Difference Table Preview</h3>
          <p className="preview-info">
            Live preview of {method === 'forward' ? "Newton's Forward" : method === 'backward' ? "Newton's Backward" : "Central"} Difference Table
          </p>
          <DifferenceTable headers={previewTable.headers} rows={previewTable.rows} precision={precision} />
        </div>
      )}
    </div>
  );
};

export default Calculator;