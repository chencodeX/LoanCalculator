// LoanCalculator.js
import React, { useState } from 'react';

const LoanCalculator = () => {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(3.15);
  const [years, setYears] = useState(25);
  const [earlyPayments, setEarlyPayments] = useState([[1, 10000]]); // 默认每月提前还款1万
  const [result, setResult] = useState(null);

  const addEarlyPayment = () => {
    setEarlyPayments([...earlyPayments, [1, 10000]]);
  };

  const calculateInterest = async () => {
    const response = await fetch('http://localhost:5000/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ principal, rate, years, earlyPayments }),
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

      {earlyPayments.map((payment, index) => (
        <div key={index}>
          <input
            type="number"
            value={payment[0]} // 提前还款的时间间隔
            onChange={(e) => {
              const newPayments = [...earlyPayments];
              newPayments[index][0] = Number(e.target.value);
              setEarlyPayments(newPayments);
            }}
            placeholder="间隔月份"
          />
          <input
            type="number"
            value={payment[1]} // 提前还款的金额
            onChange={(e) => {
              const newPayments = [...earlyPayments];
              newPayments[index][1] = Number(e.target.value);
              setEarlyPayments(newPayments);
            }}
            placeholder="提前还款金额"
          />
        </div>
      ))}

      <button onClick={addEarlyPayment}>添加提前还款计划</button>
      <button onClick={calculateInterest}>计算</button>

      {result && (
        <div>
          <h2>计算结果</h2>
          <p>总利息: {result.total_interest.toFixed(2)}元</p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;