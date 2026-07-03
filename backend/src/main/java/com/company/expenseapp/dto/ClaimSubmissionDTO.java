package com.company.expenseapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ClaimSubmissionDTO {

    @NotBlank(message = "Employee name is required")
    private String employeeName;

    @NotBlank(message = "Department is required")
    private String departmentName;

    @NotBlank(message = "Expense category is required")
    private String expenseCategory;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Expense amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    private String description;
}
