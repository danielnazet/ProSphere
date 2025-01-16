import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import Clients from './pages/Clients';
import Accounting from './pages/Accounting';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/accounting" element={<Accounting />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;