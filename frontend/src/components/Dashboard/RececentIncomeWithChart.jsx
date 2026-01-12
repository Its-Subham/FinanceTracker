import React, { useState, useEffect } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RececentIncomeWithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);
  const prepareChartData = () => {
    if (!Array.isArray(data)) {
      setChartData([]);
      return;
    }

    const dataArr = data.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));

    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={data}
        label="Total Income"
        totalAmount={`${totalIncome}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default RececentIncomeWithChart;
