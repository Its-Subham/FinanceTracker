const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add Income Source
exports.addIncome = async (req, res) => {
  const userId = req.user._id;
  const { icon, source, amount, date } = req.body;

  try {
    const income = await Income.create({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    res.status(201).json(income);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding income source.", error: error.message });
  }
};

// Get All Income Sources
exports.getAllIncome = async (req, res) => {
  const userId = req.user._id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting income sources.", error: error.message });
  }
};

// Delete Income Source
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    res.status(200).json(income);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting income source.", error: error.message });
  }
};

// Download Income Excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = incomes.map((income) => ({
      source: income.source,
      amount: income.amount,
      date: income.date.toDateString(),
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Income");
    xlsx.writeFile(workbook, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error downloading income excel.",
        error: error.message,
      });
  }
};
