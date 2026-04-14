/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { ExpenseList } from './pages/ExpenseList';

export default function App() {
  return (
    <ExpenseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add" element={<AddExpense />} />
            <Route path="list" element={<ExpenseList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ExpenseProvider>
  );
}
