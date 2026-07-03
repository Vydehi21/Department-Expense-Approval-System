package com.company.expenseapp.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "department_budgets",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"departmentName", "budgetMonth", "budgetYear"})}
)
public class DepartmentBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Department is required")
    @Column(nullable = false)
    private String departmentName;

    @NotNull(message = "Budget month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Column(nullable = false)
    private Integer budgetMonth;

    @NotNull(message = "Budget year is required")
    @Column(nullable = false)
    private Integer budgetYear;

    @NotNull(message = "Monthly budget amount is required")
    @Min(value = 1, message = "Monthly budget amount must be greater than zero")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyBudget;


}