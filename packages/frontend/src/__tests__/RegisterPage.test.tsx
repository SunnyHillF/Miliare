import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import { AuthProvider } from '../contexts/AuthContext';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
}

describe('RegisterPage', () => {
  it('renders step 1 form', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
  });
});
