import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import Model from "../../components/Model";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.status) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Error fetching expense data", error);
    } finally {
      setLoading(false);
    }
  };

  // Handel Add Expense
  const handelAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validate Inputs
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) < 0) {
      toast.error(
        "Amount is required and should be a valid number greater than 0"
      );
      return;
    }
    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(`${API_PATHS.EXPENSE.ADD_EXPENSE}`, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense Added Successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.log("Error adding Expense", error);
      toast.error("Error Adding Expense");
    }
  };

  // Handle Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.EXPENSE.DELETE_EXPENSE(id)}`);
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense Deleted Successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.log("Error deleting Expense", error);
      toast.error("Error Deleting Expense");
    }
  };

  // handle download Expense details
  const handleDownloadExpenseDetails = async () => {
    try{ 
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}`,{
        responseType: 'blob'
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    catch(error){
      console.log('Error downloading expense details', error);
      toast.error("Error downloading expense details, Please try again.");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Model
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handelAddExpense} />
        </Model>

        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title="Delete Expense"
          >
            <DeleteAlert
              content={`Are you sure you want to delete this expense details ?`}
              onDelete={()=>deleteExpense(openDeleteAlert.data)}
            />
          </Model>

      </div>
    </DashboardLayout>
  );
};

export default Expense;
