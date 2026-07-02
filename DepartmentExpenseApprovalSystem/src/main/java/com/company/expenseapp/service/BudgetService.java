package com.company.expenseapp.service;

import com.company.expenseapp.dto.MonthlySummaryDTO;
import com.company.expenseapp.entity.DepartmentBudget;

public interface BudgetService {
    DepartmentBudget saveBudget(DepartmentBudget budget);
    MonthlySummaryDTO getMonthlySummary(String department, Integer month, Integer year);
}
