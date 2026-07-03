package com.company.expenseapp.controller;

import com.company.expenseapp.dto.MonthlySummaryDTO;
import com.company.expenseapp.entity.DepartmentBudget;
import com.company.expenseapp.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    // FR-3 & Validation Rule 5, 6: Setup / Maintain Department Budget
    @PostMapping
    public ResponseEntity<DepartmentBudget> createBudget(@Valid @RequestBody DepartmentBudget budget) {
        DepartmentBudget savedBudget = budgetService.saveBudget(budget);
        return new ResponseEntity<>(savedBudget, HttpStatus.CREATED);
    }

    // FR-6: Fetch Monthly Financial Dashboard Statistics
    @GetMapping("/summary")
    public ResponseEntity<MonthlySummaryDTO> getMonthlySummary(
            @RequestParam("department") String department,
            @RequestParam("month") Integer month,
            @RequestParam("year") Integer year) {
        
        MonthlySummaryDTO summary = budgetService.getMonthlySummary(department, month, year);
        return ResponseEntity.ok(summary);
    }
}
