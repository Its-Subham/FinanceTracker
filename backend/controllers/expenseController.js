const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense Source
exports.addExpense = async (req, res) => {
  const userId = req.user._id;
  const { icon, category, amount, date } = req.body;

  try {
    const expense = await Expense.create({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    res.status(201).json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding expense source.", error: error.message });
  }
};

// Get All Expense Sources
exports.getAllExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting expense sources.", error: error.message });
  }
};

// Delete Income Source
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Income.findByIdAndDelete(req.params.id);
    res.status(200).json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting expense source.", error: error.message });
  }
};

// Download Income Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = expense.map((expense) => ({
      category: expense.category,
      amount: expense.amount,
      date: expense.date.toDateString(),
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Expense");
    xlsx.writeFile(workbook, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error downloading expense excel.",
        error: error.message,
      });
  }
};
