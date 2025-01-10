// LoanCalculator.js
import React, { useState } from 'react';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(3.15);
  const [years, setYears] = useState(25);
  const [result, setResult] = useState(null);

  const calculateInterest = async () => {
    const response = await fetch('http://localhost:5000/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ principal, rate, years }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <input
        type="number"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
        placeholder="贷款本金"
      />
      <input
        type="number"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        placeholder="年利率"
      />
      <input
        type="number"
        value={years}
        onChange={(e) => setYears(e.target.value)}
        placeholder="贷款年限"
      />
      <button onClick={calculateInterest}>计算</button>

      {result && (
        <div>
          <h2>计算结果</h2>
          <p>每年提前还款12万，总利息: {result.total_interest_yearly.toFixed(2)}元</p>
          <p>每月提前还款1万，总利息: {result.total_interest_monthly.toFixed(2)}元</p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;