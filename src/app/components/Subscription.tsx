// components/Subscription.tsx

import { useState } from 'react';

const Subscription: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    console.log("Current email:", value); // Debugging log
    // Simple email validation check
    setIsValidEmail(/\S+@\S+\.\S+/.test(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to create subscription');
      // Handle successful subscription (e.g., show confirmation)
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-12 px-8 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-4xl font-extrabold mb-4 text-center">Join Our Book Lovers Subscription!</h2>
      <p className="mb-6 text-center text-lg">Subscribe for exclusive offers and the latest book updates.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className={`p-3 mb-4 w-full max-w-xs rounded-lg focus:outline-none focus:ring-2 ${isValidEmail ? 'focus:ring-white' : 'focus:ring-red-500'}`}
          required
        />
        {!isValidEmail && <p className="text-red-300 text-sm">Please enter a valid email address.</p>}
        <button
          type="submit"
          className={`bg-white text-blue-500 font-bold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Subscribe'}
        </button>
      </form>
      {error && <p className="mt-4 text-red-300 text-center">{error}</p>}
    </div>
  );
};

export default Subscription;



