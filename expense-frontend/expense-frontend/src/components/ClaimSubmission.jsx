import React, { useState } from 'react';
import { expenseApi } from '../api/expenseApi';
// 🪙 Import the central corporate array matrix structures 
import { DEPARTMENTS, EXPENSE_CATEGORIES } from '../constants/appConstants';

function ClaimSubmission() {
  // Central form state initialization linked directly to index records
  const [formData, setFormData] = useState({
    employeeName: '',
    departmentName: DEPARTMENTS[0], // 👈 Defaults to 'Engineering' dynamically
    expenseCategory: EXPENSE_CATEGORIES[0], // 👈 Defaults to first element dynamically
    amount: '',
    expenseDate: '',
    description: ''
  });

  // User notification status states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle standard input updates dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission dispatcher
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Local explicit validation check before firing the API request
    if (parseFloat(formData.amount) <= 0 || isNaN(parseFloat(formData.amount))) {
      setMessage({ type: 'error', text: 'Expense amount must be greater than zero.' });
      setLoading(false);
      return;
    }

    try {
      // Send validated payload structural object directly to Spring Boot
      const response = await expenseApi.submitClaim({
        ...formData,
        amount: parseFloat(formData.amount)
      });

      // Clear form inputs and alert employee on successful entry creation
      setMessage({ type: 'success', text: `Claim submitted successfully! Claim ID: ${response.data.id}` });
      setFormData({
        employeeName: '',
        departmentName: DEPARTMENTS[0], // 👈 Dynamic safe reset
        expenseCategory: EXPENSE_CATEGORIES[0], // 👈 Dynamic safe reset
        amount: '',
        expenseDate: '',
        description: ''
      });
    } catch (error) {
      // Handle server-side validation error mapping gracefully
      const serverError = error.response?.data?.message || 'Failed to submit claim. Please check inputs.';
      setMessage({ type: 'error', text: serverError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>📝 New Expense Claim Submission</h2>
      <p style={styles.subtitle}>Enter your company operational costs to routing structures for management review.</p>

      {/* Alert Notification Banners */}
      {message.text && (
        <div style={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Employee Full Name *</label>
            <input
              type="text"
              name="employeeName"
              required
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Target Department *</label>
            <select
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              style={styles.select}
            >
              {/* 🔄 Programmatic Loop: Eliminates duplicate option bugs across views */}
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Expense Category *</label>
            <select
              name="expenseCategory"
              value={formData.expenseCategory}
              onChange={handleChange}
              style={styles.select}
            >
              {/* 🔄 Programmatic Loop: Automatically maps clean categories text */}
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Total Amount (INR) *</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Expense Occurrence Date *</label>
          <input
            type="date"
            name="expenseDate"
            required
            value={formData.expenseDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            rows="3"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide context regarding why this expense was made..."
            style={styles.textarea}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Processing System Submission...' : 'Submit Claim Package'}
        </button>
      </form>
    </div>
  );
}

// Clean professional component stylesheet mappings
const styles = {
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '22px' },
  subtitle: { margin: '0 0 25px 0', color: '#6b7280', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '2px' },
  row: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  group: { display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 250px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px' },
  select: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px', backgroundColor: 'white', color: '#374151' },
  textarea: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px', fontFamily: 'inherit' },
  button: { padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '10px' },
  successAlert: { padding: '12px 20px', backgroundColor: '#def7ec', color: '#03543f', borderRadius: '6px', fontSize: '14px', fontWeight: '500' },
  errorAlert: { padding: '12px 20px', backgroundColor: '#fde8e8', color: '#9b1c1c', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }
};

export default ClaimSubmission;
