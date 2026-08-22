import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ExceptionQueue from './pages/ExceptionQueue';
import TransactionDetails from './pages/TransactionDetails';
import AuditLog from './pages/AuditLog';
import Settings from './pages/Settings';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="exceptions" element={<ExceptionQueue />} />
          <Route path="exceptions/:transactionId" element={<TransactionDetails />} />
          <Route path="audit-log" element={<AuditLog />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
