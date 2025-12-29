import React from 'react';
import MathDisplay from './MathDisplay';

const ExpandedPolynomialDisplay = ({ step, xValue, precision = 4, method }) => {
  if (!step || !xValue) return null;
  // Get x0, h, y0, deltaYs
  let x0, h, y0;
  if (method === 'forward') {
    x0 = step.result.rows[0][0];
    h = step.result.rows[1]?.[0] - step.result.rows[0][0] || 1;
    y0 = step.result.rows[0][1];
  } else if (method === 'backward') {
    x0 = step.result.rows[step.result.rows.length - 1][0];
    h = step.result.rows[step.result.rows.length - 1]?.[0] - step.result.rows[step.result.rows.length - 2]?.[0] || 1;
    y0 = step.result.rows[step.result.rows.length - 1][1];
  } else {
    const midIdx = Math.floor(step.result.rows.length / 2);
    x0 = step.result.rows[midIdx][0];
    h = step.result.rows[1]?.[0] - step.result.rows[0][0] || 1;
    y0 = step.result.rows[midIdx][1];
  }
  const x0Num = parseFloat(x0);
  const hNum = parseFloat(h);
  const y0Num = parseFloat(y0);
  const deltaYs = [];
  for (let i = 2; i < step.result.headers.length; i++) {
    const diffVal = step.result.rows[0][i];
    if (diffVal === '-' || diffVal === undefined || diffVal === null || isNaN(diffVal)) break;
    deltaYs.push(diffVal);
  }
  let polyTerms = [`${y0Num.toFixed(precision)}`];
  if (deltaYs.length > 0) polyTerms.push(`+ (${deltaYs[0].toFixed(precision)}/${hNum.toFixed(precision)})*(x - ${x0Num.toFixed(precision)})`);
  if (deltaYs.length > 1) polyTerms.push(`+ (${deltaYs[1].toFixed(precision)}/${(2*hNum*hNum).toFixed(precision)})*(x - ${x0Num.toFixed(precision)})*(x - ${(x0Num+hNum).toFixed(precision)})`);
  if (deltaYs.length > 2) polyTerms.push(`+ (${deltaYs[2].toFixed(precision)}/${(6*hNum*hNum*hNum).toFixed(precision)})*(x - ${x0Num.toFixed(precision)})*(x - ${(x0Num+hNum).toFixed(precision)})*(x - ${(x0Num+2*hNum).toFixed(precision)})`);
  if (deltaYs.length > 3) polyTerms.push(`+ (${deltaYs[3].toFixed(precision)}/${(24*hNum*hNum*hNum*hNum).toFixed(precision)})*(x - ${x0Num.toFixed(precision)})*(x - ${(x0Num+hNum).toFixed(precision)})*(x - ${(x0Num+2*hNum).toFixed(precision)})*(x - ${(x0Num+3*hNum).toFixed(precision)})`);
  const polyLatex = `f(x) = ${polyTerms.join(' ')}`;
  return (
    <div className="expanded-polynomial-display" style={{marginTop: '2em', background: '#eaf6ff', padding: '1em', borderRadius: '8px'}}>
      <h4>Expanded & Simplified Polynomial in x</h4>
      <MathDisplay expression={polyLatex} />
    </div>
  );
};

export default ExpandedPolynomialDisplay;
