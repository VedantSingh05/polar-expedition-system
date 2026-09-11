import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111827] border border-[#1E3A5F] rounded-2xl p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">❄️</div>
            <h1 className="text-2xl font-bold text-[#38BDF8] tracking-widest uppercase">
              Polar Command System
            </h1>
            <p className="text-[#9CA3AF] text-sm mt-2">
              Ministry of Earth Sciences&nbsp;|&nbsp;NCPOR
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#9CA3AF] text-sm mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="commander@ncpor.in"
                required
                className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#9CA3AF] text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1F2937] border border-[#1E3A5F] text-[#F9FAFB] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#38BDF8] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#38BDF8] text-[#0B1120] font-bold py-2.5 rounded-lg hover:bg-[#7DD3FC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-[#1F2937] rounded-lg">
            <p className="text-[#9CA3AF] text-xs text-center font-semibold mb-2 uppercase tracking-wider">
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-[#9CA3AF]">
              <p><span className="text-[#38BDF8]">Commander:</span> commander@ncpor.in / password123</p>
              <p><span className="text-[#38BDF8]">Logistics:</span> logistics@ncpor.in / password123</p>
              <p><span className="text-[#38BDF8]">Field:</span> personnel@ncpor.in / password123</p>
            </div>
          </div>

          <p className="text-[#9CA3AF] text-xs text-center mt-6 leading-relaxed">
            Prototype for SIH 2026. Not affiliated with NCPOR or MoES official systems.
          </p>
        </div>
      </div>
    </div>
  );
}
