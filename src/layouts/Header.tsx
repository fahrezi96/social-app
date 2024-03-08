import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles.module.css';
import { useState } from 'react';
import Login from '../components/Login';
import { useDispatch, useSelector } from 'react-redux';
import { UserState, emptyUser } from '../services/global';
import { setUser } from '../slices/userSlice';

function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, token } = useSelector((state: UserState) => state.user.data);
  const dispatch = useDispatch();
  const navivgate = useNavigate();

  const onLogout = () => {
    dispatch(setUser(emptyUser));
    localStorage.removeItem('data');
    navivgate('/');
  };

  return (
    <>
      <header className={styles.header}>
        <nav className="navbar navbar-expand-lg bg-danger ">
          <div className="container">
            <Link className="navbar-brand text-white" to="/">
              Cybernews
            </Link>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="posts">
                  Posts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="writers">
                  Writers
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="about-us">
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="contact-us">
                  Contact Us
                </NavLink>
              </li>
            </ul>

            {token == '' ? (
              <button className="btn btn-warning ms-2" onClick={() => setShowLogin(true)}>
                Login
              </button>
            ) : (
              <>
                <p className="text-white mb-0">
                  Welcome,
                  <Link to={`/writers/${user?.id}`} className="ms-2 text-white">
                    <strong>{user?.username}</strong>
                  </Link>
                </p>
                <button className="btn btn-warning ms-2" onClick={onLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      {showLogin ? <Login onClose={() => setShowLogin(false)} /> : null}
    </>
  );
}

export default Header;
