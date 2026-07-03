package com.company.expenseapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "expense_claims")
public class ExpenseClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employee name is required")
    @Column(nullable = false)
    private String employeeName;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String departmentName;

    @NotBlank(message = "Expense category is required")
    @Column(nullable = false)
    private String expenseCategory;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Expense amount must be greater than zero")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Expense date is required")
    @Column(nullable = false)
    private LocalDate expenseDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExpenseStatus claimStatus = ExpenseStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String reviewRemark;
}
