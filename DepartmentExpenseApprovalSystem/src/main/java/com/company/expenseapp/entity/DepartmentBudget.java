package com.company.expenseapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

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

    // Constructors
    public DepartmentBudget() {}

    public DepartmentBudget(String departmentName, Integer budgetMonth, Integer budgetYear, BigDecimal monthlyBudget) {
        this.departmentName = departmentName;
        this.budgetMonth = budgetMonth;
        this.budgetYear = budgetYear;
        this.monthlyBudget = monthlyBudget;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Integer getBudgetMonth() { return budgetMonth; }
    public void setBudgetMonth(Integer budgetMonth) { this.budgetMonth = budgetMonth; }

    public Integer getBudgetYear() { return budgetYear; }
    public void setBudgetYear(Integer budgetYear) { this.budgetYear = budgetYear; }

    public BigDecimal getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(BigDecimal monthlyBudget) { this.monthlyBudget = monthlyBudget; }
}
