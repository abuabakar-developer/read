// app/cancel/page.tsx
'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-100">
      <div className="bg-white shadow-lg p-8 rounded-lg text-center max-w-md mx-auto">
        <Image
          src="/images/cancel-illustration.svg" // Add a relevant illustration here
          alt="Payment Canceled"
          width={200}
          height={200}
          className="mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-red-600">Oops! Payment Canceled</h2>
        <p className="text-gray-600 mt-4">
          Your payment was not processed. Don't worry, you can try again or explore our collection of amazing books!
        </p>
        <div className="mt-6 space-x-4">
          <button
            onClick={() => router.push('/')} // Redirect to home
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Return to Store
          </button>
        </div>
      </div>
    </div>
  );
}
