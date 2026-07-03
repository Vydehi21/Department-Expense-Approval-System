import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseApi = {
  // Budget Endpoints
  createBudget: (budgetData) => API.post('/budgets', budgetData),
  getMonthlySummary: (dept, month, year) => 
    API.get(`/budgets/summary?department=${dept}&month=${month}&year=${year}`),

  // Expense Claims Endpoints
  submitClaim: (claimData) => API.post('/expenses', claimData),
  getFilteredClaims: (filters) => {
    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.month) params.append('month', filters.month);
    if (filters.year) params.append('year', filters.year);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    return API.get(`/expenses?${params.toString()}`);
  },
  reviewClaim: (id, reviewData) => API.put(`/expenses/${id}/review`, reviewData),
};
