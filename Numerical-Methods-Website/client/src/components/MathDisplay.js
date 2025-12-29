// client/src/components/MathDisplay.js
import React, { useEffect } from 'react';

const MathDisplay = ({ expression }) => {
  // Convert simple expressions to LaTeX
  const toLaTeX = (expr) => {
    // Handle null or undefined
    if (!expr) {
      return '';
    }
    
    // Handle arrays
    if (Array.isArray(expr)) {
      return `\\left[ ${expr.join(', ')} \\right]`;
    }
    
    // Handle difference tables
    if (typeof expr === 'object' && expr.rows) {
      let latex = "\\begin{array}{c|" + "c".repeat(expr.rows[0].length) + "}\n";
      latex += "x & " + expr.headers.join(" & ") + " \\\\\n\\hline\n";
      expr.rows.forEach(row => {
        latex += row.join(" & ") + " \\\\\n";
      });
      latex += "\\end{array}";
      return latex;
    }
    
    // Handle numbers
    if (typeof expr === 'number') {
      return expr.toString();
    }
    
    // Basic formatting for strings
    if (typeof expr === 'string') {
      return expr
        .replace(/\*\*/g, '^')
        .replace(/Δ/g, '\\Delta ')
        .replace(/∇/g, '\\nabla ')
        .replace(/δ/g, '\\delta ');
    }
    
    return '';
  };

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise().catch(err => console.log(err));
    }
  }, [expression]);

  try {
    const latex = toLaTeX(expression);
    return (
      <div style={{ fontSize: '1.2em', padding: '10px' }}>
        {`$$${latex}$$`}
      </div>
    );
  } catch (error) {
    console.error('MathDisplay error:', error);
    return <div style={{ fontSize: '1.2em', padding: '10px' }}>Error rendering expression</div>;
  }
};

export default MathDisplay;