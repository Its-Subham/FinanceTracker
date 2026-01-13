
import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
}

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(' ');
    let initials ="";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i].charAt(0);
    }

    return initials.toUpperCase();
}

export const addThousandsSeparator = (number) => {
    if(number == null || isNaN(number)){
        return "";
    }
    const [integerPart, fractionalPart] = number.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
}   

export const prepareExpenseBarChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  return data.map((item) => ({
    category: item?.category || "Unknown",
    amount: item?.amount || 0,
  }));
};


export const prepareIncomeBarChartData = (transactions = []) => {
  if (!Array.isArray(transactions)) return [];

  return transactions.map((item) => ({
    category: item?.source || "Unknown",
    amount: item?.amount || 0,
  }));
};


export const prepareExpenseLineChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const sortData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortData.map((item) => ({
    month: moment(item?.date).format("DD MMM"),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};

