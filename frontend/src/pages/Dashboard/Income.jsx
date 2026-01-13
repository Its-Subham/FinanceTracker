import React, { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import DashboardLayout from '../../components/layout/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import Model from '../../components/Model'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'
import { useUserAuth } from '../../hooks/useUserAuth'

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddInomeModal, setOpenAddInomeModal] = useState(false);

  // Get All Income Details
  const fetchIncomeDetails = async () => {
    if(loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);

      if(response.status){
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log('Error fetching income data', error);
    } finally {
      setLoading(false);
    }
  };

  // Handel Add Income
  const handelAddIncome = async (income) => {
    const {source, amount, date, icon} = income;

    // Validate Inputs
    if(!source.trim()){
      toast.error("Source is required");
      return;
    }
    if(!amount || isNaN(amount) || Number(amount) < 0){
      toast.error("Amount is required and should be a valid number greater than 0");
      return;
    }
    if(!date){
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(`${API_PATHS.INCOME.ADD_INCOME}`, {source, amount, date, icon});

      setOpenAddInomeModal(false);
      toast.success("Income Added Successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.log('Error adding income', error);
      toast.error("Error Adding Income"); 

    }

  };

  // Handle Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.INCOME.DELETE_INCOME(id)}`);
      setOpenDeleteAlert({show: false, data: null});
      toast.success("Income Deleted Successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.log('Error deleting income', error);
      toast.error("Error Deleting Income"); 
    }
  }

  // handle download income details
  const handleDownloadIncomeDetails = async () => {};


  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-col-1 gap-6'>
          <div className=''>
            <IncomeOverview 
              transactions={incomeData}
              onAddIncome={() => setOpenAddInomeModal(true)}
            />

            <IncomeList 
              transactions={incomeData}
              onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
              onDownload={() => handleDownloadIncomeDetails}
            />

          </div>
        </div>
        <Model
          isOpen={openAddInomeModal}
          onClose={() => setOpenAddInomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handelAddIncome} />
        </Model>

        <Model
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title="Delete Income"
          >
            <DeleteAlert
              content={`Are you sure you want to delete?`}
              onDelete={()=>deleteIncome(openDeleteAlert.data)}
            />
          </Model>
      </div>
    </DashboardLayout>
  )
}

export default Income