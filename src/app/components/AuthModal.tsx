import { useState } from 'react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, name: string) => void;
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering ? { email, password, name } : { email, password };
         
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data.token, data.name);
        setSuccessMessage(isRegistering ? 'Registration successful!' : 'Login successful!');
        onClose();
      } else {
        setError(data.message);
        setSuccessMessage(null);
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch {
      setError('Authentication failed. Please try again.');
      setSuccessMessage(null);
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 transition-all ease-in-out">
      <div className="bg-gray-50 p-8 rounded-lg shadow-2xl w-11/12 sm:w-96 relative transform scale-95 hover:scale-100 transition-transform duration-300 ease-in-out">
        {/* Branding */}
        <h1 className="text-4xl font-extrabold text-green-700 text-center mb-1 tracking-wide font-serif">
          ABreads
        </h1>

        {/* Title and subheading */}
        <h2 className="text-3xl font-semibold mb-2 text-gray-800 text-center">
          {isRegistering ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <hr className="border-gray-300 mb-2" />
        {!isRegistering && (
          <p className="text-lg font-light text-gray-600 text-center mb-6 tracking-wide">
            Log in to your account
          </p>
        )}

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mb-3 text-center">{successMessage}</p>}

        {/* Form */}
        <form onSubmit={handleAuth}>
          {isRegistering && (
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-gray-600">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-gray-600">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        {/* Toggle between login and registration */}
        <p className="mt-4 text-center text-gray-600">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-green-600 hover:underline focus:outline-none transition"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Log In' : 'Sign Up'}
          </button>
        </p>

        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  ) : null;
};

export default AuthModal;



















