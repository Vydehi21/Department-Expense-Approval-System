package com.company.expenseapp.service.impl;

import com.company.expenseapp.dto.ClaimSubmissionDTO;
import com.company.expenseapp.dto.ReviewRequestDTO;
import com.company.expenseapp.entity.DepartmentBudget;
import com.company.expenseapp.entity.ExpenseClaim;
import com.company.expenseapp.entity.ExpenseStatus;
import com.company.expenseapp.exception.BudgetExceededException;
import com.company.expenseapp.exception.ResourceNotFoundException;
import com.company.expenseapp.repository.BudgetRepository;
import com.company.expenseapp.repository.ExpenseClaimRepository;
import com.company.expenseapp.service.ExpenseClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ExpenseClaimServiceImpl implements ExpenseClaimService {

    @Autowired
    private ExpenseClaimRepository claimRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Override
    public ExpenseClaim submitClaim(ClaimSubmissionDTO dto) {
        ExpenseClaim claim = new ExpenseClaim();
        claim.setEmployeeName(dto.getEmployeeName());
        claim.setDepartmentName(dto.getDepartmentName());
        claim.setExpenseCategory(dto.getExpenseCategory());
        claim.setAmount(dto.getAmount());
        claim.setExpenseDate(dto.getExpenseDate());
        claim.setDescription(dto.getDescription());
        claim.setClaimStatus(ExpenseStatus.PENDING);

        return claimRepository.save(claim);
    }

    @Override
    public List<ExpenseClaim> getClaims(String department, Integer month, Integer year, ExpenseStatus status, String category) {
        return claimRepository.findClaimsByFilters(department, month, year, status, category);
    }
    @Override
    public ExpenseClaim reviewClaim(Long claimId, ReviewRequestDTO reviewDto) {
        // 🛡️ Strict Backend Authorization Check
        if (!"MANAGER".equalsIgnoreCase(reviewDto.getUserRole()) && !"FINANCE_ADMIN".equalsIgnoreCase(reviewDto.getUserRole())) {
            throw new BudgetExceededException("Access Denied: Only Department Managers or Finance Admins can evaluate expense claims.");
        }

        ExpenseClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense claim with ID " + claimId + " not found"));

        if (claim.getClaimStatus() != ExpenseStatus.PENDING) {
            throw new BudgetExceededException("This claim has already been evaluated and cannot be modified.");
        }

        if (reviewDto.getStatus() == ExpenseStatus.APPROVED) {
            int targetMonth = claim.getExpenseDate().getMonthValue();
            int targetYear = claim.getExpenseDate().getYear();

            DepartmentBudget budgetAllocation = budgetRepository
                    .findByDepartmentNameAndBudgetMonthAndBudgetYear(claim.getDepartmentName(), targetMonth, targetYear)
                    .orElseThrow(() -> new BudgetExceededException("Approval blocked: No budget limit set for " 
                            + claim.getDepartmentName() + " department for " + targetMonth + "/" + targetYear));

            BigDecimal totalApprovedExpenses = claimRepository.sumExpensesByStatus(
                    claim.getDepartmentName(), targetMonth, targetYear, ExpenseStatus.APPROVED);

            BigDecimal projectedTotal = totalApprovedExpenses.add(claim.getAmount());

            if (projectedTotal.compareTo(budgetAllocation.getMonthlyBudget()) > 0) {
                throw new BudgetExceededException("Approval blocked: Approving this claim exceeds monthly budget limit by " 
                        + projectedTotal.subtract(budgetAllocation.getMonthlyBudget()));
            }
        }

        claim.setClaimStatus(reviewDto.getStatus());
        claim.setReviewRemark(reviewDto.getReviewRemark());

        return claimRepository.save(claim);
    }


//    @Override
//    public ExpenseClaim reviewClaim(Long claimId, ReviewRequestDTO reviewDto) {
//        ExpenseClaim claim = claimRepository.findById(claimId)
//                .orElseThrow(() -> new ResourceNotFoundException("Expense claim with ID " + claimId + " not found"));
//
//        if (claim.getClaimStatus() != ExpenseStatus.PENDING) {
//            throw new BudgetExceededException("This claim has already been evaluated and cannot be modified.");
//        }
//
//        if (reviewDto.getStatus() == ExpenseStatus.APPROVED) {
//            int targetMonth = claim.getExpenseDate().getMonthValue();
//            int targetYear = claim.getExpenseDate().getYear();
//
//            DepartmentBudget budgetAllocation = budgetRepository
//                    .findByDepartmentNameAndBudgetMonthAndBudgetYear(claim.getDepartmentName(), targetMonth, targetYear)
//                    .orElseThrow(() -> new BudgetExceededException("Approval blocked: No budget limit set for " 
//                            + claim.getDepartmentName() + " department for " + targetMonth + "/" + targetYear));
//
//            BigDecimal totalApprovedExpenses = claimRepository.sumExpensesByStatus(
//                    claim.getDepartmentName(), targetMonth, targetYear, ExpenseStatus.APPROVED);
//
//            BigDecimal projectedTotal = totalApprovedExpenses.add(claim.getAmount());
//
//            if (projectedTotal.compareTo(budgetAllocation.getMonthlyBudget()) > 0) {
//                throw new BudgetExceededException("Approval blocked: Approving this claim exceeds monthly budget limit by " 
//                        + projectedTotal.subtract(budgetAllocation.getMonthlyBudget()));
//            }
//        }
//
//        claim.setClaimStatus(reviewDto.getStatus());
//        claim.setReviewRemark(reviewDto.getReviewRemark());
//
//        return claimRepository.save(claim);
//    }
}
