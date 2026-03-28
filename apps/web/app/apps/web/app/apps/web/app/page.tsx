'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [balances, setBalances] = useState([]);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    // Fetch data logic here (protected route)
    // axios.get('/api/balances')...
    setPrice(45000); // Mock price
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between mb-8">
        <h1 className="text-2xl font-bold">CryptoExchange MVP</h1>
        <button className="bg-red-500 px-4 py-2 rounded">Logout</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Balance Card */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl mb-4">Your Assets</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>USDT</span>
              <span>10,000.00</span>
            </div>
            <div className="flex justify-between">
              <span>BTC</span>
              <span>0.50000000</span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl mb-4">Trade BTC/USDT</h2>
          <div className="text-green-400 text-lg mb-4">Price: ${price}</div>
          <form className="space-y-4">
            <input type="number" placeholder="Price" className="w-full p-2 bg-gray-700 rounded" />
            <input type="number" placeholder="Amount" className="w-full p-2 bg-gray-700 rounded" />
            <div className="flex gap-4">
              <button className="flex-1 bg-green-600 py-2 rounded hover:bg-green-700">Buy</button>
              <button className="flex-1 bg-red-600 py-2 rounded hover:bg-red-700">Sell</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
