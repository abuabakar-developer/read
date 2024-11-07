// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface UserInfo {
  name: string;
  // Add any other fields present in your decoded token here
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Decode token to get user data (replace this with your own API call if necessary)
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserInfo(decodedToken);
    } else {
      router.push('/'); // Redirect to home if not authenticated
    }
  }, [router]);

  if (!userInfo) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard, {userInfo.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Your Wishlist</h2>
          {/* Render wishlist items here */}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Your Orders</h2>
          {/* Render order history here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

