import { FormEvent, useState } from 'react';
import { FormLogin, baseUrl } from '../services/global';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';
import { useNavigate } from 'react-router-dom';

function Login({ onClose }: { onClose: () => void }) {
  const [formLogin, setFormLogin] = useState<FormLogin>({
    userId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/users/${formLogin.userId}`);
      dispatch(setUser({ user: await response.json(), token: 'xyz123' }));
      onClose();
      alert('Login success');
      navigate('/writers/' + formLogin.userId);
    } catch (error) {
      console.log(error);
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal show" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login Form</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form autoComplete="off" onSubmit={(e) => onLogin(e)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">User ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={formLogin.userId}
                  onChange={(e) => setFormLogin({ ...formLogin, userId: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formLogin.password}
                  onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary">
                Reset
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
