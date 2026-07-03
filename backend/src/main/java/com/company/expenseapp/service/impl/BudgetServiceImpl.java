package com.company.expenseapp.service.impl;

import com.company.expenseapp.dto.MonthlySummaryDTO;
import com.company.expenseapp.entity.DepartmentBudget;
import com.company.expenseapp.entity.ExpenseStatus;
import com.company.expenseapp.exception.BudgetExceededException;
import com.company.expenseapp.repository.BudgetRepository;
import com.company.expenseapp.repository.ExpenseClaimRepository;
import com.company.expenseapp.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@Service
@Transactional
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseClaimRepository claimRepository;

    @Override
    public DepartmentBudget saveBudget(DepartmentBudget budget) {
        budgetRepository.findByDepartmentNameAndBudgetMonthAndBudgetYear(
                budget.getDepartmentName(), budget.getBudgetMonth(), budget.getBudgetYear())
                .ifPresent(existing -> {
                    throw new BudgetExceededException("Budget already exists for department " 
                        + budget.getDepartmentName() + " in month " + budget.getBudgetMonth() + "/" + budget.getBudgetYear());
                });
        return budgetRepository.save(budget);
    }

    @Override
    public MonthlySummaryDTO getMonthlySummary(String department, Integer month, Integer year) {
        BigDecimal monthlyBudget = budgetRepository.findByDepartmentNameAndBudgetMonthAndBudgetYear(department, month, year)
                .map(DepartmentBudget::getMonthlyBudget)
                .orElse(BigDecimal.ZERO);

        BigDecimal totalApproved = claimRepository.sumExpensesByStatus(department, month, year, ExpenseStatus.APPROVED);
        BigDecimal totalPending = claimRepository.sumExpensesByStatus(department, month, year, ExpenseStatus.PENDING);
        BigDecimal remainingBudget = monthlyBudget.subtract(totalApproved);

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth(); 

        long pendingCount = claimRepository.countByDepartmentNameAndClaimStatusAndExpenseDateBetween(department, ExpenseStatus.PENDING, start, end);
        long approvedCount = claimRepository.countByDepartmentNameAndClaimStatusAndExpenseDateBetween(department, ExpenseStatus.APPROVED, start, end);
        long rejectedCount = claimRepository.countByDepartmentNameAndClaimStatusAndExpenseDateBetween(department, ExpenseStatus.REJECTED, start, end);

        return MonthlySummaryDTO.builder()
                .departmentName(department)
                .month(month)
                .year(year)
                .monthlyBudget(monthlyBudget)
                .totalApprovedExpense(totalApproved)
                .totalPendingExpense(totalPending)
                .remainingBudget(remainingBudget)
                .numberOfPendingClaims(pendingCount)
                .numberOfApprovedClaims(approvedCount)
                .numberOfRejectedClaims(rejectedCount)
                .build();
    }
}
