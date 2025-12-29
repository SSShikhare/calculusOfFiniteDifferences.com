// server/controllers/calculationController.js
const Calculation = require('../models/Calculation');

// Helper function to build Newton's Forward Difference Table
const buildForwardDifferenceTable = (xValues, yValues, order) => {
  const steps = [];
  const n = yValues.length;
  
  // Calculate forward differences
  const differences = [yValues.map((y, i) => ({ value: y, index: i }))];
  
  let lastDiff = order;
  for (let diff = 1; diff <= order && diff < n; diff++) {
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
    
    if (nextDiff.length === 1) break;
  }
  
  // Build display table only for the final difference level
  const displayRows = [];
  for (let i = 0; i < n; i++) {
    const row = [xValues[i], yValues[i]];
    for (let d = 1; d <= lastDiff && d < differences.length; d++) {
      if (i < differences[d].length) {
        row.push(differences[d][i].value.toFixed(4));
      } else {
        row.push('-');
      }
    }
    displayRows.push(row);
  }
  
  const headers = ['x_i', 'y_i'];
  for (let d = 1; d <= lastDiff; d++) {
    headers.push(`Δ^${d}y_i`);
  }
  
  steps.push({
    title: `Newton's Forward Difference Table (Order ${lastDiff})`,
    explanation: `Forward difference table up to order ${lastDiff}. Each column shows the differences calculated from the previous column.`,
    result: {
      headers: headers,
      rows: displayRows
    },
    chartData: {
      labels: xValues.map(x => `x=${x.toFixed(2)}`),
      values: yValues,
      label: 'Function Values (Y)'
    },
    chartTitle: `Forward Difference Table - Order ${lastDiff}`
  });
  
  return steps;
};

// Helper function to build Newton's Backward Difference Table
const buildBackwardDifferenceTable = (xValues, yValues, order) => {
  const steps = [];
  const n = yValues.length;
  
  // Calculate backward differences using formula: ∇y_i = y_i - y_{i-1}
  const differences = [yValues.map((y, i) => ({ value: y, index: i }))];
  
  let lastDiff = order;
  for (let diff = 1; diff <= order && diff < n; diff++) {
    const nextDiff = [];
    const prevDiff = differences[diff - 1];
    
    // Backward differences: ∇y_i = y_i - y_{i-1}
    for (let i = 1; i < prevDiff.length; i++) {
      nextDiff.push({
        value: prevDiff[i].value - prevDiff[i - 1].value,
        index: i
      });
    }
    
    differences.push(nextDiff);
    lastDiff = diff;
    
    if (nextDiff.length === 1) break;
  }
  
  // Build display table only for the final difference level
  // Backward differences are positioned from right to left starting from bottom rows
  const displayRows = [];
  for (let i = 0; i < n; i++) {
    const row = [xValues[i], yValues[i]];
    for (let d = 1; d <= lastDiff && d < differences.length; d++) {
      // Position backward differences: only show if we have enough rows below
      if (i >= d - 1 && (i - d) >= 0 && (i - d) < differences[d].length) {
        row.push(differences[d][i - d].value.toFixed(4));
      } else {
        row.push('-');
      }
    }
    displayRows.push(row);
  }
  
  const headers = ['x_i', 'y_i'];
  for (let d = 1; d <= lastDiff; d++) {
    headers.push(`∇^${d}y_i`);
  }
  
  steps.push({
    title: `Newton's Backward Difference Table (Order ${lastDiff})`,
    explanation: `Backward difference table up to order ${lastDiff}. Formula: ∇^1y_i = y_i - y_{i-1}. Each column shows the differences calculated from the previous column.`,
    result: {
      headers: headers,
      rows: displayRows
    },
    chartData: {
      labels: xValues.map(x => `x=${x.toFixed(2)}`),
      values: yValues,
      label: 'Function Values (Y)'
    },
    chartTitle: `Backward Difference Table - Order ${lastDiff}`
  });
  
  return steps;
};

// Helper function to build Newton's Central Difference Table
const buildCentralDifferenceTable = (xValues, yValues, order) => {
  const steps = [];
  const n = yValues.length;
  
  // Calculate central differences using formula: δy_{i+1/2} = y_{i+1} - y_i
  const differences = [yValues.map((y, i) => ({ value: y, index: i }))];
  
  let lastDiff = order;
  for (let diff = 1; diff <= order && diff < n; diff++) {
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
    const row = [xValues[i], yValues[i]];
    for (let d = 1; d <= lastDiff && d < differences.length; d++) {
      // Position central differences
      if (i < differences[d].length) {
        row.push(differences[d][i].value.toFixed(4));
      } else {
        row.push('-');
      }
    }
    displayRows.push(row);
  }
  
  const headers = ['x_i', 'y_i'];
  for (let d = 1; d <= lastDiff; d++) {
    headers.push(`δ^${d}y_{i+1/2}`);
  }
  
  steps.push({
    title: `Newton's Central Difference Table (Order ${lastDiff})`,
    explanation: `Central difference table up to order ${lastDiff}. Formula: δy_{i+1/2} = y_{i+1} - y_i. Each column shows the central differences calculated from the previous column.`,
    result: {
      headers: headers,
      rows: displayRows
    },
    chartData: {
      labels: xValues.map(x => `x=${x.toFixed(2)}`),
      values: yValues,
      label: 'Function Values (Y)'
    },
    chartTitle: `Central Difference Table - Order ${lastDiff}`
  });
  
  return steps;
};

// Helper function to calculate central differences (legacy - kept for compatibility)
const calculateCentralDifferences = (values, order) => {
  const steps = [];
  let currentValues = [...values];
  let differences = [currentValues];
  
  steps.push({
    title: 'Initial Values',
    explanation: 'The given function values at equally spaced points',
    result: {
      headers: Array.from({length: values.length}, (_, i) => `y_${i}`),
      rows: [values]
    },
    chartData: {
      labels: Array.from({length: values.length}, (_, i) => `x_${i}`),
      values: values,
      label: 'Function Values'
    },
    chartTitle: 'Initial Function Values'
  });
  
  for (let i = 1; i <= order; i++) {
    const nextDiff = [];
    for (let j = 0; j < currentValues.length - 1; j++) {
      nextDiff.push(currentValues[j + 1] - currentValues[j]);
    }
    
    // For central differences, we need to adjust indexing
    if (i === 1) {
      steps.push({
        title: 'First Order Forward Differences (for Central)',
        explanation: 'Central differences use forward differences at midpoints',
        formula: '\\delta y_{i+\\frac{1}{2}} = y_{i+1} - y_i',
        calculation: `δ = [${nextDiff.join(', ')}]`,
        result: nextDiff,
        chartData: {
          labels: Array.from({length: nextDiff.length}, (_, j) => `x_${j}+0.5`),
          values: nextDiff,
          label: 'First Order Forward'
        },
        chartTitle: 'First Order Forward Differences'
      });
    }
    
    // Calculate actual central differences for even orders
    if (i % 2 === 0) {
      const centralDiff = [];
      const prevDiff = differences[differences.length - 1];
      for (let j = 1; j < prevDiff.length; j++) {
        centralDiff.push(prevDiff[j] - prevDiff[j - 1]);
      }
      
      steps.push({
        title: `Order ${i} Central Differences`,
        explanation: `Central differences of order ${i}: δ^${i}y_i = δ^{${i-1}}y_{i+\\frac{1}{2}} - δ^{${i-1}}y_{i-\\frac{1}{2}}`,
        formula: `\\delta^{${i}} y_i = \\delta^{${i-1}} y_{i+\\frac{1}{2}} - \\delta^{${i-1}} y_{i-\\frac{1}{2}}`,
        calculation: `δ^${i} = [${centralDiff.join(', ')}]`,
        result: centralDiff,
        chartData: {
          labels: Array.from({length: centralDiff.length}, (_, j) => `x_${j+1}`),
          values: centralDiff,
          label: `Order ${i} Central`
        },
        chartTitle: `Order ${i} Central Differences`
      });
      
      differences.push(centralDiff);
      currentValues = centralDiff;
    } else {
      differences.push(nextDiff);
      currentValues = nextDiff;
    }
    
    if (currentValues.length <= 1) break;
  }
  
  return steps;
};


const calculateDifferences = async (req, res) => {
  try {
    const { xValues, yValues, method, stepSize, order } = req.body;
    
    // Validate input
    if (!xValues || !Array.isArray(xValues) || xValues.length < 2) {
      return res.status(400).json({ error: 'Invalid xValues array - must have at least 2 values' });
    }
    
    if (!yValues || !Array.isArray(yValues) || yValues.length < 2) {
      return res.status(400).json({ error: 'Invalid yValues array - must have at least 2 values' });
    }
    
    if (xValues.length !== yValues.length) {
      return res.status(400).json({ error: 'xValues and yValues must have same length' });
    }
    
    // Validate numbers
    const validateNumbers = (arr) => arr.every(val => typeof val === 'number' && !isNaN(val));
    if (!validateNumbers(xValues)) {
      return res.status(400).json({ error: 'xValues must contain valid numbers' });
    }
    if (!validateNumbers(yValues)) {
      return res.status(400).json({ error: 'yValues must contain valid numbers' });
    }
    
    if (!method || !['forward', 'backward', 'central'].includes(method)) {
      return res.status(400).json({ error: 'Invalid method - must be forward, backward, or central' });
    }
    
    if (!order || order < 1 || order > 5) {
      return res.status(400).json({ error: 'Order must be between 1 and 5' });
    }
    
    let steps;
    switch (method) {
      case 'forward':
        steps = buildForwardDifferenceTable(xValues, yValues, order);
        break;
      case 'backward':
        steps = buildBackwardDifferenceTable(xValues, yValues, order);
        break;
      case 'central':
        steps = buildCentralDifferenceTable(xValues, yValues, order);
        break;
      default:
        return res.status(400).json({ error: 'Invalid method' });
    }
    
    // Save to database if connected
    try {
      const calculation = new Calculation({
        input: { xValues, yValues, method, stepSize: parseFloat(stepSize) || 1, order: parseInt(order) },
        steps
      });
      await calculation.save();
    } catch (dbError) {
      console.warn('Database save warning:', dbError.message);
      // Continue even if database fails
    }
    
    res.json({ steps });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Calculation failed: ' + error.message });
  }
};

module.exports = { calculateDifferences };