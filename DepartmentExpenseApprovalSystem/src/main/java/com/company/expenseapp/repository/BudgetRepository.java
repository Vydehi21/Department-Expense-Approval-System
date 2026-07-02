package com.company.expenseapp.repository;

import com.company.expenseapp.entity.DepartmentBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<DepartmentBudget, Long> {
    
    // Finds a budget for a specific department and month/year combo (Validation rule 6)
    Optional<DepartmentBudget> findByDepartmentNameAndBudgetMonthAndBudgetYear(
            String departmentName, Integer budgetMonth, Integer budgetYear);
}
