// client/src/components/DifferenceTable.js
import React from 'react';
import MathDisplay from './MathDisplay';

const DifferenceTable = ({ headers, rows, precision = 4 }) => {
  if (!headers || !rows || rows.length === 0) {
    return <div className="table-error">No table data available</div>;
  }

  // Helper function to convert header to LaTeX format
  const headerToLatex = (header) => {
    // Handle x_i
    if (header === 'x_i') {
      return 'x_{i}';
    }
    
    // Handle y_i
    if (header === 'y_i') {
      return 'y_{i}';
    }

    // Handle forward differences: Δ^1y_i, Δ^2y_i, etc.
    const forwardMatch = header.match(/^Δ\^(\d+)y_i$/);
    if (forwardMatch) {
      const order = forwardMatch[1];
      return `\\Delta^{${order}}y_{i}`;
    }

    // Handle backward differences: ∇^1y_i, ∇^2y_i, etc.
    const backwardMatch = header.match(/^∇\^(\d+)y_i$/);
    if (backwardMatch) {
      const order = backwardMatch[1];
      return `\\nabla^{${order}}y_{i}`;
    }

    // Handle central differences: δ^1y_{i+1/2}, δ^2y_i, etc.
    const centralMatch = header.match(/^δ\^(\d+)y_(.+)$/);
    if (centralMatch) {
      const order = centralMatch[1];
      const subscript = centralMatch[2];
      
      if (subscript === '{i+1/2}') {
        return `\\delta^{${order}}y_{i+1/2}`;
      } else if (subscript === 'i') {
        return `\\delta^{${order}}y_{i}`;
      }
    }

    // Fallback to original
    return header;
  };

  // Helper function to generate tooltip LaTeX for a cell
  const getTooltipLatex = (cellIndex, rowIndex) => {
    // For X column
    if (cellIndex === 0) {
      return `x_{${rowIndex}}`;
    }
    
    // For Y column
    if (cellIndex === 1) {
      return `y_{${rowIndex}}`;
    }

    // Get the header for this column
    const header = headers[cellIndex];
    if (!header) return null;

    // Extract the difference symbol (Δ, ∇, or δ) and order
    const deltaMatch = header.match(/^(Δ|∇|δ)\^(\d+)/);
    if (!deltaMatch) return null;

    const symbol = deltaMatch[1];
    const order = deltaMatch[2];

    // Generate tooltip LaTeX based on difference type
    if (symbol === 'Δ') {
      // Forward: Δ^d y_i
      return `\\Delta^{${order}}y_{${rowIndex}}`;
    } else if (symbol === '∇') {
      // Backward: ∇^d y_i
      return `\\nabla^{${order}}y_{${rowIndex}}`;
    } else if (symbol === 'δ') {
      // Central: δ^d y_{i+1/2}
      return `\\delta^{${order}}y_{${rowIndex}+1/2}`;
    }

    return null;
  };

  // Tooltip component
  const CellTooltip = ({ latex, children }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);

    if (!latex) {
      return children;
    }

    return (
      <div className="cell-with-tooltip" style={{ position: 'relative', display: 'inline-block' }}>
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{ cursor: 'help' }}
        >
          {children}
        </div>
        {showTooltip && (
          <div className="math-tooltip">
            <MathDisplay expression={latex} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="difference-table-wrapper">
      <table className="difference-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="table-header">
                <span className="header-text">
                  <MathDisplay expression={headerToLatex(header)} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}>
              {row.map((cell, cellIndex) => {
                const tooltipLatex = getTooltipLatex(cellIndex, rowIndex);
                return (
                  <td 
                    key={cellIndex} 
                    className={`table-cell ${cellIndex === 0 ? 'x-column' : ''} ${cellIndex === 1 ? 'y-column' : 'difference-column'}`}
                    data-column={cellIndex}
                  >
                    <CellTooltip latex={tooltipLatex}>
                      <span className="cell-value">
                        {typeof cell === 'number' ? cell.toFixed(precision) : cell}
                      </span>
                    </CellTooltip>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DifferenceTable;
