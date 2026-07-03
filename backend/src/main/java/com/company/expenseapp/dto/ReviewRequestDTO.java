package com.company.expenseapp.dto;

import com.company.expenseapp.entity.ExpenseStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequestDTO {

    @NotNull(message = "Action status (APPROVED or REJECTED) is required")
    private ExpenseStatus status;
    @NotNull(message="Remark is required")
    private String reviewRemark;
    @NotNull(message = "User role is required to verify permissions")
    private String userRole;
}
