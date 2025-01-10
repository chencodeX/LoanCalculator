# app.py
from flask import Flask, request, jsonify

from flask_cors import CORS  # 导入 CORS

app = Flask(__name__)
CORS(app)  # 启用 CORS


def calculate_loan_interest(principal, annual_rate, years, early_payments):
    months = years * 12
    monthly_rate = annual_rate / 12 / 100
    remaining_principal = principal
    total_interest_paid = 0

    for month in range(1, months + 1):
        if remaining_principal <= 0:  # 如果本金已经还清，提前退出
            break

        monthly_principal_payment = principal / months
        monthly_interest_payment = remaining_principal * monthly_rate
        total_interest_paid += monthly_interest_payment

        remaining_principal -= monthly_principal_payment

        # 遍历提前还款计划
        for payment in early_payments:
            interval, amount = payment
            if month % interval == 0:
                remaining_principal -= amount
                if remaining_principal < 0:
                    remaining_principal = 0

    return total_interest_paid, remaining_principal


@app.route('/calculate', methods=['POST'])
def calculate():
    print("Received request")  # 使用 print 语句进行调试

    data = request.json
    principal = data['principal']
    rate = data['rate']
    years = data['years']

    early_payments = [
        (1, 10000),  # 每月提前还款1万
        (6, 60000),  # 每半年提前还款6万
        (12, 120000)  # 每年提前还款12万
    ]

    total_interest, _ = calculate_loan_interest(principal, rate, years, early_payments)

    return jsonify({'total_interest': total_interest})


if __name__ == '__main__':
    app.run(debug=True)