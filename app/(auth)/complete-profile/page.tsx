// pages/complete-profile.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const CompleteProfile = () => {
  const [number, setNumber] = useState('');
  const router = useRouter();
  const { userId } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;

    try {
      await axios.post('/api/complete-profile', { userId, number });
      router.push('/'); // Redirect to dashboard after completion
    } catch (error) {
      console.error('Failed to complete profile', error);
    }
  };

  return (
    <div>
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Phone Number:
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
