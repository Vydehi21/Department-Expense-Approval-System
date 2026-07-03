package com.company.expenseapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDTO {
    private String departmentName;
    private Integer month;
    private Integer year;
    private BigDecimal monthlyBudget;
    private BigDecimal totalApprovedExpense;
    private BigDecimal totalPendingExpense;
    private BigDecimal remainingBudget;
    private long numberOfPendingClaims;
    private long numberOfApprovedClaims;
    private long numberOfRejectedClaims;
}
