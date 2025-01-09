#!/usr/bin/python
# -*- coding: UTF-8 -*-
"""
@Author : chenzihao1@oppo.com
@File : app.py
@Create Date : 2025/01/09
@Description :
"""
# app.py
from flask import Flask, request, jsonify

app = Flask(__name__)


def calculate_loan_interest(principal, annual_rate, years, extra_payment=None):
    months = years * 12
    monthly_rate = annual_rate / 12 / 100
    remaining_principal = principal
    total_interest_paid = 0

    for month in range(1, months + 1):
        monthly_principal_payment = principal / months
        monthly_interest_payment = remaining_principal * monthly_rate
        total_interest_paid += monthly_interest_payment

        remaining_principal -= monthly_principal_payment

        if extra_payment and month % extra_payment[0] == 0:
            remaining_principal -= extra_payment[1]
            if remaining_principal < 0:
                remaining_principal = 0

        if remaining_principal <= 0:
            break

    return total_interest_paid, remaining_principal


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    principal = data['principal']
    rate = data['rate']
    years = data['years']

    yearly_early_payment = (12, 120000)
    total_interest_yearly, _ = calculate_loan_interest(principal, rate, years, yearly_early_payment)

    monthly_early_payment = (1, 10000)
    total_interest_monthly, _ = calculate_loan_interest(principal, rate, years, monthly_early_payment)

    return jsonify({
        'total_interest_yearly': total_interest_yearly,
        'total_interest_monthly': total_interest_monthly
    })


if __name__ == '__main__':
    app.run(debug=True)