const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
    try {
        const userId = new Types.ObjectId(req.user._id);

        // ---------------- TOTAL INCOME ----------------
        const totalIncome = await Income.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // ---------------- TOTAL EXPENSE ----------------
        const totalExpense = await Expense.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // ---------------- LAST 60 DAYS ----------------
        const last60Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: last60Days }
        });

        const last60DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: last60Days }
        });

        // ---------------- LAST 30 DAYS EXPENSE ----------------
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: last30Days }
        });

        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, txn) => sum + txn.amount,
            0
        );

        // ---------------- RECENT TRANSACTIONS (LAST 5) ----------------
        const recentIncome = await Income.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        const recentExpense = await Expense.find({ userId })
            .sort({ date: -1 })
            .limit(5);

        const recentTransactions = [
            ...recentIncome.map(txn => ({
                ...txn.toObject(),
                type: "income"
            })),
            ...recentExpense.map(txn => ({
                ...txn.toObject(),
                type: "expense"
            }))
        ]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        // ---------------- RESPONSE ----------------
        res.status(200).json({
            totalBalance:
                (totalIncome[0]?.total || 0) -
                (totalExpense[0]?.total || 0),

            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,

            last30DaysExpense: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },

            last60DaysIncome: {
                total: last60DaysIncomeTransactions.reduce(
                    (sum, txn) => sum + txn.amount,
                    0
                ),
                transactions: last60DaysIncomeTransactions
            },

            recentTransactions
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting dashboard data.",
            error: error.message
        });
    }
};
