package com.company.expenseapp.service;

import com.company.expenseapp.dto.ClaimSubmissionDTO;
import com.company.expenseapp.dto.ReviewRequestDTO;
import com.company.expenseapp.entity.ExpenseClaim;
import com.company.expenseapp.entity.ExpenseStatus;
import java.util.List;

public interface ExpenseClaimService {
    ExpenseClaim submitClaim(ClaimSubmissionDTO dto);
    List<ExpenseClaim> getClaims(String department, Integer month, Integer year, ExpenseStatus status, String category);
    ExpenseClaim reviewClaim(Long claimId, ReviewRequestDTO reviewDto);
}
