import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { verifyPassword } from '../services/userService';

const PasswordCheck = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isValid = await verifyPassword(user.loginId, password);
      if (isValid) {
        navigate('/user-config');
      } else {
        setError('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>비밀번호 확인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">확인</button>
      </form>
    </div>
  );
};

export default PasswordCheck;