import React, { useState, useEffect } from "react";
import { expenseApi } from "../api/expenseApi";
import { DEPARTMENTS, EXPENSE_CATEGORIES } from "../constants/appConstants";

function ExpenseBoard({currentUser }) {
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState({
    department: "",
    month: "",
    year: "",
    status: "",
    category: "",
  });

  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(false);

  const [globalMessage, setGlobalMessage] = useState({
    type: "",
    text: "",
  });

  const [selectedClaim, setSelectedClaim] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    status: "APPROVED",
    reviewRemark: "",
  });

  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetchClaimsData();
  }, [filters]);

  const fetchClaimsData = async () => {
    setLoading(true);

    try {
      const response = await expenseApi.getFilteredClaims(filters);

      setClaims(response.data);
    } catch (error) {
      setGlobalMessage({
        type: "error",

        text: "Could not fetch records",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;

    setReviewForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

 const executeReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewRemark || reviewForm.reviewRemark.trim().length < 5) {
      setGlobalMessage({ type: "error", text: "Evaluation Blocked: Review remark required (min 5 chars)." });
      return;
    }
    
    setReviewLoading(true);
    try {
      // 📝 Append the user role directly into your API body parameters
      await expenseApi.reviewClaim(selectedClaim.id, {
        ...reviewForm,
        userRole: currentUser.role // 👈 Sends active role context straight to backend
      });

      setGlobalMessage({ type: "success", text: `Successfully updated Claim ID ${selectedClaim.id}` });
      setSelectedClaim(null);
      setReviewForm({ status: "APPROVED", reviewRemark: "" });
      fetchClaimsData();
    } catch (error) {
      setGlobalMessage({ type: "error", text: error.response?.data?.message || "Failed to update" });
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div style={styles.workspace}>
      <h2 style={styles.title}>📋 Operational Claims Ledger Board</h2>

      <p style={styles.subtitle}>Filter, audit, and evaluate expense items.</p>

      {globalMessage.text && (
        <div
          style={
            globalMessage.type === "success"
              ? styles.successAlert
              : styles.errorAlert
          }
        >
          {globalMessage.text}
        </div>
      )}

      <div style={styles.filterCard}>
        <h4 style={styles.filterTitle}>🔍 Filter Matrix Parameters</h4>

        <div style={styles.filterRow}>
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            style={styles.selectFilter}
          >
            <option value="">All Departments</option>

            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            style={styles.selectFilter}
          >
            <option value="">All Categories</option>

            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            style={styles.selectFilter}
          >
            <option value="">All Status</option>

            <option>PENDING</option>

            <option>APPROVED</option>

            <option>REJECTED</option>
          </select>

          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            style={styles.selectFilter}
          >
            <option value="">All Months</option>

            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("en-US", { month: "short" })}
              </option>
            ))}
          </select>

          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            style={styles.selectFilter}
          >
            <option value="">All Years</option>

            <option>{currentYear}</option>

            <option>{currentYear + 1}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingArea}>Loading...</div>
      ) : claims.length === 0 ? (
        <div style={styles.emptyArea}>No records found</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>

                <th style={styles.th}>Employee</th>

                <th style={styles.th}>Department</th>

                <th style={styles.th}>Amount</th>

                <th style={styles.th}>Status</th>

                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td style={styles.td}>#{claim.id}</td>

                  <td style={styles.td}>{claim.employeeName}</td>

                  <td style={styles.td}>{claim.departmentName}</td>

                  <td style={styles.td}>₹{claim.amount}</td>

                  <td style={styles.td}>
                    <span style={styles.statusBadge(claim.claimStatus)}>
                      {claim.claimStatus}
                    </span>
                  </td>

                  <td style={styles.td}>
                    {claim.claimStatus === "PENDING" ? (
                      <button
                        style={styles.actionBtn}
                        onClick={() => setSelectedClaim(claim)}
                      >
                        Evaluate
                      </button>
                    ) : (
                      "Evaluated"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedClaim && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <h3>⚖️ Audit Evaluation</h3>

            <p>Reviewing {selectedClaim.employeeName}</p>

            <form onSubmit={executeReviewSubmit}>
              <select
                name="status"
                value={reviewForm.status}
                onChange={handleReviewChange}
                style={styles.select}
              >
                <option value="APPROVED">APPROVE</option>

                <option value="REJECTED">REJECT</option>
              </select>

              <textarea
                name="reviewRemark"
                value={reviewForm.reviewRemark}
                onChange={handleReviewChange}
                style={styles.textarea}
                placeholder="Remark"
                required
              />

              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                style={styles.cancelBtn}
              >
                Cancel
              </button>

              <button disabled={reviewLoading} style={styles.confirmBtn}>
                {reviewLoading ? "Saving..." : "Confirm"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  workspace: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  title: {
    color: "#1e3a8a",
  },

  subtitle: {
    color: "#6b7280",
  },

  filterCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
  },

  filterTitle: {
    fontWeight: "600",
  },

  filterRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  selectFilter: {
    padding: "8px",
    borderRadius: "6px",
  },

  loadingArea: {
    padding: "40px",
    textAlign: "center",
  },

  emptyArea: {
    padding: "40px",
    textAlign: "center",
  },

  tableWrapper: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    overflow: "hidden",
    marginTop: "15px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },

  th: {
    backgroundColor: "#f3f4f6", // Light gray background for headers
    color: "#1f2937",           // Explicit dark charcoal text color
    padding: "12px 16px",
    fontWeight: "600",
    borderBottom: "2px solid #e5e7eb" // Clear separating line
  },

  td: {
    padding: "14px 16px",
    color: "#374151",           // Explicit crisp gray text color for data rows
    borderBottom: "1px solid #e5e7eb"
  },

  actionBtn: {
    padding: "6px 12px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
  },

  successAlert: {
    padding: '12px 20px', 
    backgroundColor: '#def7ec', 
    color: '#03543f', 
    border: '1px solid #84e1bc', // 👈 Crisp border line
    borderRadius: '6px', 
    fontSize: '14px', 
    fontWeight: '600'
  },

  errorAlert: {
     padding: '12px 20px', 
    backgroundColor: '#fde8e8', 
    color: '#9b1c1c', 
    border: '1px solid #f8b4b4', // 👈 Crisp red border line
    borderRadius: '6px', 
    fontSize: '14px', 
    fontWeight: '700'
  },

  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "400px",
  },

  select: {
    padding: "10px",
    width: "100%",
  },

  textarea: {
    padding: "10px",
    width: "100%",
    marginTop: "10px",
  },

  cancelBtn: {
    marginTop: "10px",
    padding: "8px",
  },

  confirmBtn: {
    marginLeft: "10px",
    padding: "8px",
    backgroundColor: "#1e3a8a",
    color: "white",
  },

  statusBadge: (status) => ({
    padding: "5px",

    borderRadius: "5px",

    backgroundColor:
      status === "APPROVED"
        ? "#def7ec"
        : status === "REJECTED"
          ? "#fde8e8"
          : "#fef3c7",
  }),
};

export default ExpenseBoard;