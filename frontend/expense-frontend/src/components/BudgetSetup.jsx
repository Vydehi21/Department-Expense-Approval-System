import React, { useState } from 'react';
import { expenseApi } from '../api/expenseApi';
// 🪙 Import the central corporate array matrix structure
import { DEPARTMENTS } from '../constants/appConstants';

function BudgetSetup() {
  // Setup state tracking current calendar year automatically
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    departmentName: DEPARTMENTS[0], // 👈 Dynamic default fallback ('Engineering')
    budgetMonth: 1,
    budgetYear: currentYear,
    monthlyBudget: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Client-side quick positive integer checks
    if (parseFloat(formData.monthlyBudget) <= 0 || isNaN(parseFloat(formData.monthlyBudget))) {
      setMessage({ type: 'error', text: 'Monthly budget must be a positive number greater than zero.' });
      setLoading(false);
      return;
    }

    try {
      await expenseApi.createBudget({
        ...formData,
        budgetMonth: parseInt(formData.budgetMonth),
        budgetYear: parseInt(formData.budgetYear),
        monthlyBudget: parseFloat(formData.monthlyBudget)
      });

      setMessage({ 
        type: 'success', 
        text: `Allocated budget successfully locked for ${formData.departmentName} (${formData.budgetMonth}/${formData.budgetYear})!` 
      });
      
      setFormData((prev) => ({ ...prev, monthlyBudget: '' }));
    } catch (error) {
      // Capture structural custom exceptions from Spring Boot (like duplicate entries or database blocks)
      const serverError = error.response?.data?.message || 'Failed to map department budget structural rules.';
      setMessage({ type: 'error', text: serverError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>💰 Maintain Department Budget Allocation</h2>
      <p style={styles.subtitle}>Define monthly maximum monetary allocations to enforce strict validation ceilings across claim approval systems.</p>

      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Select Department *</label>
            <select
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              style={styles.select}
            >
              {/* 🔄 Programmatic Loop: Fixes option mismatches */}
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Total Allocation Limit (INR) *</label>
            <input
              type="number"
              name="monthlyBudget"
              step="1"
              required
              value={formData.monthlyBudget}
              onChange={handleChange}
              placeholder="e.g., 500000"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Target Operational Month *</label>
            <select
              name="budgetMonth"
              value={formData.budgetMonth}
              onChange={handleChange}
              style={styles.select}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Target Year *</label>
            <select
              name="budgetYear"
              value={formData.budgetYear}
              onChange={handleChange}
              style={styles.select}
            >
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear + 1}>{currentYear + 1}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Securing Budget Configuration...' : 'Initialize & Freeze Department Budget'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '22px' },
  subtitle: { margin: '0 0 25px 0', color: '#6b7280', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  group: { display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 250px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' },
  select: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px', backgroundColor: 'white', color: '#374151' },
  button: { padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '10px' },
  successAlert: { padding: '12px 20px', backgroundColor: '#def7ec', color: '#03543f', borderRadius: '6px', fontSize: '14px', fontWeight: '500' },
  errorAlert: { padding: '12px 20px', backgroundColor: '#fde8e8', color: '#9b1c1c', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }
};

export default BudgetSetup;
