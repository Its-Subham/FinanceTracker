import React, { useState } from 'react'
import Input from '../inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddExpenseForm = ({onAddExpense}) => {
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value });
  return (
    <div>
        <EmojiPickerPopup
         icon={expense.icon}
         onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}         
        />

        <Input
            value={expense.category}
            onChange={(e) => handleChange('category', e.target.value)}
            label="Category"
            type="text"
            placeholder="Rent, Groceries, etc"
        />
        <Input
            value={expense.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            label="Amount"
            type="number"
            placeholder=""
        />
        <Input
            value={expense.date}
            onChange={(e) => handleChange('date', e.target.value)}
            label="Date"
            type="date"
            placeholder=""
        />
        
        <div className='flex justify-end mt-6'>
            <button
                type="button"
                className='add-btn add-btn-fill'
                onClick={()=>onAddExpense(expense)}
            >
                Add Expense
            </button>
        </div>

    </div>
  )
}

export default AddExpenseForm