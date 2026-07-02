package com.company.expenseapp.repository;

import com.company.expenseapp.entity.ExpenseClaim;
import com.company.expenseapp.entity.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseClaimRepository extends JpaRepository<ExpenseClaim, Long> {

    // FR-5: Custom filtering options for tracking claims dynamically
    @Query("SELECT e FROM ExpenseClaim e WHERE " +
           "(:dept IS NULL OR e.departmentName = :dept) AND " +
           "(:month IS NULL OR FUNCTION('MONTH', e.expenseDate) = :month) AND " +
           "(:year IS NULL OR FUNCTION('YEAR', e.expenseDate) = :year) AND " +
           "(:status IS NULL OR e.claimStatus = :status) AND " +
           "(:category IS NULL OR e.expenseCategory = :category)")
    List<ExpenseClaim> findClaimsByFilters(
            @Param("dept") String dept,
            @Param("month") Integer month,
            @Param("year") Integer year,
            @Param("status") ExpenseStatus status,
            @Param("category") String category);

    // Helper for FR-4 & FR-6: Sum up expenses by status for a department's specific month/year
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseClaim e WHERE " +
           "e.departmentName = :dept AND " +
           "FUNCTION('MONTH', e.expenseDate) = :month AND " +
           "FUNCTION('YEAR', e.expenseDate) = :year AND " +
           "e.claimStatus = :status")
    BigDecimal sumExpensesByStatus(
            @Param("dept") String dept,
            @Param("month") Integer month,
            @Param("year") Integer year,
            @Param("status") ExpenseStatus status);

    // Helper for FR-6: Count claims by status
    long countByDepartmentNameAndClaimStatusAndExpenseDateBetween(
            String departmentName, ExpenseStatus status, java.time.LocalDate start, java.time.LocalDate end);
}
