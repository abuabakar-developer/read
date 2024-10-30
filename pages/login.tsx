import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      toast.success('Login successful');
      router.push('/');
    } else {
      toast.error('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mb-4 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mb-6 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button type="submit" className="w-full bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 transition duration-200">Login</button>
      </form>
    </div>
  );
};

export default Login;

