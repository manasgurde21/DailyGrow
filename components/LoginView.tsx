import React from 'react';
import { Mail } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-body-tertiary px-4">
      <div className="card border-0 shadow-lg rounded-4 w-100" style={{ maxWidth: '400px' }}>
        <div className="card-body p-5 text-center">
          <div className="bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow" style={{ width: '80px', height: '80px' }}>
            <span className="h1 fw-bold mb-0">DG</span>
          </div>
          <h2 className="fw-bold mb-2">Welcome Back</h2>
          <p className="text-muted mb-4">Sign in to continue your growth journey</p>

          <div className="d-grid gap-3">
            <button onClick={onLogin} className="btn btn-outline-secondary btn-lg d-flex align-items-center justify-content-center gap-2 rounded-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
              <span className="fs-6 fw-medium">Continue with Google</span>
            </button>
            
            <button onClick={onLogin} className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2 rounded-3">
              <Mail size={20} />
              <span className="fs-6 fw-medium">Continue with Email</span>
            </button>
          </div>

          <div className="mt-4 text-muted small">
            By continuing, you agree to our <a href="#" className="text-decoration-none">Terms</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;