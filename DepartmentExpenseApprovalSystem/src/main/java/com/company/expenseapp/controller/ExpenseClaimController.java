package com.company.expenseapp.controller;

import com.company.expenseapp.dto.ClaimSubmissionDTO;
import com.company.expenseapp.dto.ReviewRequestDTO;
import com.company.expenseapp.entity.ExpenseClaim;
import com.company.expenseapp.entity.ExpenseStatus;
import com.company.expenseapp.service.ExpenseClaimService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseClaimController {

    @Autowired
    private ExpenseClaimService claimService;

    // FR-1 & Validation Rule 1, 2, 3, 4: Submit Expense Claim
    @PostMapping
    public ResponseEntity<ExpenseClaim> submitExpenseClaim(@Valid @RequestBody ClaimSubmissionDTO submissionDto) {
        ExpenseClaim savedClaim = claimService.submitClaim(submissionDto);
        return new ResponseEntity<>(savedClaim, HttpStatus.CREATED);
    }

    // FR-5: Advanced Expense Board Filtering Matrix
    @GetMapping
    public ResponseEntity<List<ExpenseClaim>> fetchFilteredClaims(
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "month", required = false) Integer month,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "status", required = false) ExpenseStatus status,
            @RequestParam(value = "category", required = false) String category) {
        
        List<ExpenseClaim> filteredClaims = claimService.getClaims(department, month, year, status, category);
        return ResponseEntity.ok(filteredClaims);
    }

    // FR-2 & FR-4: Process Manager Decision (Approve / Reject) with Budget Cap Enforcement
    @PutMapping("/{id}/review")
    public ResponseEntity<ExpenseClaim> reviewExpenseClaim(
            @PathVariable("id") Long claimId,
            @Valid @RequestBody ReviewRequestDTO reviewDto) {
        
        ExpenseClaim updatedClaim = claimService.reviewClaim(claimId, reviewDto);
        return ResponseEntity.ok(updatedClaim);
    }
}
