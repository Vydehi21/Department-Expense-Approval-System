import React, { useState } from 'react';
import ClaimSubmission from './components/ClaimSubmission';
import BudgetSetup from './components/BudgetSetup';
import ExpenseBoard from './components/ExpenseBoard';
import DashboardSummary from './components/DashboardSummary';

function App() {
  // Global Session State
  const [currentUser, setCurrentUser] = useState({
    name: 'Rahul Sharma',
    role: 'EMPLOYEE' // Options: EMPLOYEE, FINANCE_MANAGER
  });
  
  const [activeTab, setActiveTab] = useState('submit-claim');

  // Handle role changes and auto-switch tabs if access is lost
  const handleRoleChange = (e) => {
    const role = e.target.value;
    let name = 'Rahul Sharma';
    if (role === 'FINANCE_MANAGER') name = 'Manager Priya';
    
    setCurrentUser({ name, role });
    setActiveTab('submit-claim'); // Reset safely to common tab
  };

  const renderView = () => {
    switch (activeTab) {
      case 'submit-claim':
        return <ClaimSubmission currentUser={currentUser} />;
      case 'setup-budget':
        return currentUser.role === 'FINANCE_MANAGER' ? <BudgetSetup /> : <div style={styles.denied}>Access Denied</div>;
      case 'expense-board':
        return currentUser.role === 'FINANCE_MANAGER'
          ? <ExpenseBoard currentUser={currentUser} /> 
          : <div style={styles.denied}>Access Denied</div>;
      case 'dashboard':
        return <DashboardSummary />;
      default:
        return <ClaimSubmission currentUser={currentUser} />;
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      
      {/* Simulated Active Session Header Bar */}
      <div style={styles.sessionBar}>
        <span>👤 Active User: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
        <div>
          <label style={{ marginRight: '10px', fontSize: '13px' }}>Simulate Logging In As:</label>
          <select value={currentUser.role} onChange={handleRoleChange} style={styles.sessionSelect}>
            <option value="EMPLOYEE">Employee</option>
            <option value="FINANCE_MANAGER">Finance Manager</option>
          </select>
        </div>
      </div>

      <header style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '15px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🏢 Department Expense Management System</h1>
      </header>

      {/* Dynamic Tab Navigation Row based on Role Permissions */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '10px', padding: '10px 30px' }}>
        <button onClick={() => setActiveTab('submit-claim')} style={activeTab === 'submit-claim' ? styles.activeTab : styles.inactiveTab}>
          📝 Submit Claim
        </button>
        
        {/* Only visible to Finance Manager */}
        {currentUser.role === 'FINANCE_MANAGER' && (
          <button onClick={() => setActiveTab('setup-budget')} style={activeTab === 'setup-budget' ? styles.activeTab : styles.inactiveTab}>
            💰 Setup Budget 
          </button>
        )}
        
        {/* Only visible to Finance Manager */}
        {currentUser.role === 'FINANCE_MANAGER' && (
          <button onClick={() => setActiveTab('expense-board')} style={activeTab === 'expense-board' ? styles.activeTab : styles.inactiveTab}>
            📋 Approval Board
          </button>
        )}
        
        <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? styles.activeTab : styles.inactiveTab}>
          📊 Analytics Dashboard
        </button>
      </nav>

      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {renderView()}
      </main>
    </div>
  );
}

const styles = {
  sessionBar: { backgroundColor: '#1f2937', color: '#f3f4f6', padding: '8px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' },
  sessionSelect: { padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#374151', color: 'white', fontSize: '13px', cursor: 'pointer' },
  activeTab: { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  inactiveTab: { padding: '10px 20px', backgroundColor: 'transparent', color: '#4b5563', border: '1px solid transparent', borderRadius: '6px', cursor: 'pointer' },
  denied: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '20px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', border: '1px solid #f8b4b4' }
};

export default App;