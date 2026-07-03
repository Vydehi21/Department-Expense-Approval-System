import React, { useState, useEffect } from 'react';
import { expenseApi } from '../api/expenseApi';
// 🪙 Import the central corporate array matrix structure
import { DEPARTMENTS } from '../constants/appConstants';

function DashboardSummary() {
  const currentYear = new Date().getFullYear();

  // Search Matrix Filter States
  const [filters, setFilters] = useState({
    departmentName: DEPARTMENTS[0], // 👈 Dynamic default fallback ('Engineering')
    month: new Date().getMonth() + 1, // Defaults to current calendar month
    year: currentYear
  });

  // Analytics Engine Data Store State
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch summary data whenever filters change
  const fetchSummaryMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await expenseApi.getMonthlySummary(
        filters.departmentName,
        parseInt(filters.month),
        parseInt(filters.year)
      );
      setSummaryData(response.data);
    } catch (err) {
      setError('Could not compile live analytics for selection criteria.');
      setSummaryData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryMetrics();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Helper formatting utility
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0);
  };

  return (
    <div style={styles.container}>
      {/* Search Selection Controls Grid Layout */}
      <div style={styles.card}>
        <h2 style={styles.title}>📊 Executive Financial Dashboard</h2>
        <p style={styles.subtitle}>Select criteria to monitor allocation tracks, pending request loads, and remaining funding limits.</p>
        
        <div style={styles.filterRow}>
          <div style={styles.group}>
            <label style={styles.label}>Department</label>
            <select name="departmentName" value={filters.departmentName} onChange={handleFilterChange} style={styles.select}>
              {/* 🔄 Programmatic Loop: Automatically maps clean departments text */}
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Operational Month</label>
            <select name="month" value={filters.month} onChange={handleFilterChange} style={styles.select}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Fiscal Year</label>
            <select name="year" value={filters.year} onChange={handleFilterChange} style={styles.select}>
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear + 1}>{currentYear + 1}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <p style={styles.loadingText}>Compiling operational matrices from ledger registries...</p>}
      {error && <div style={styles.errorAlert}>{error}</div>}

      {/* Main Consolidated Dashboard Metric Blocks */}
      {summaryData && !loading && (
        <>
          <div style={styles.metricsGrid}>
            <div style={{ ...styles.metricCard, borderLeft: '5px solid #2563eb' }}>
              <span style={styles.metricLabel}>Total Approved Budget Allocation</span>
              <h3 style={{ ...styles.metricValue, color: '#1e3a8a' }}>{formatCurrency(summaryData.monthlyBudget)}</h3>
            </div>

            <div style={{ ...styles.metricCard, borderLeft: '5px solid #10b981' }}>
              <span style={styles.metricLabel}>Total Expense Capital Spent</span>
              <h3 style={{ ...styles.metricValue, color: '#065f46' }}>{formatCurrency(summaryData.totalApprovedExpense)}</h3>
            </div>

            <div style={{ ...styles.metricCard, borderLeft: '5px solid #f59e0b' }}>
              <span style={styles.metricLabel}>Remaining Available Funding</span>
              <h3 style={{ 
                ...styles.metricValue, 
                color: summaryData.remainingBudget < 0 ? '#b91c1c' : '#92400e' 
              }}>
                {formatCurrency(summaryData.remainingBudget)}
              </h3>
            </div>
          </div>

          {/* Core Counter Status Registry Matrix */}
          <div style={styles.statusSection}>
            <h3 style={styles.sectionTitle}>📋 Claim Submission Flow Volumes</h3>
            <div style={styles.counterRow}>
              <div style={styles.counterItem}>
                <span style={styles.countNumber}>{summaryData.numberOfPendingClaims}</span>
                <span style={styles.countLabel}>⏳ Pending Decision</span>
              </div>
              <div style={styles.counterItem}>
                <span style={{ ...styles.countNumber, color: '#10b981' }}>{summaryData.numberOfApprovedClaims}</span>
                <span style={styles.countLabel}>✅ Approved Entries</span>
              </div>
              <div style={styles.counterItem}>
                <span style={{ ...styles.countNumber, color: '#ef4444' }}>{summaryData.numberOfRejectedClaims}</span>
                <span style={styles.countLabel}>❌ Rejected Submissions</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '25px' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '22px' },
  subtitle: { margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' },
  filterRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  group: { display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 200px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#4b5563' },
  select: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '15px', backgroundColor: 'white', color: '#374151' },
  metricsGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  metricCard: { flex: '1 1 280px', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' },
  metricLabel: { fontSize: '12px', textTransform: 'uppercase', tracking: '0.05em', fontWeight: 'bold', color: '#6b7280' },
  metricValue: { margin: 0, fontSize: '26px', fontWeight: '800' },
  statusSection: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  sectionTitle: { margin: '0 0 20px 0', fontSize: '16px', color: '#374151' },
  counterRow: { display: 'flex', justifyContent: 'space-around', gap: '15px', flexWrap: 'wrap' },
  counterItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '120px' },
  countNumber: { fontSize: '32px', fontWeight: '800', color: '#f59e0b' },
  countLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500' },
  loadingText: { color: '#2563eb', fontWeight: '500', textAlign: 'center', padding: '20px' },
  errorAlert: { padding: '12px 20px', backgroundColor: '#fde8e8', color: '#9b1c1c', borderRadius: '6px', fontSize: '14px' }
};

export default DashboardSummary;
