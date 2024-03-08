import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserState, User as WriterResponse, baseUrl } from '../services/global';
import Posts from '../pages/Posts';
import Todos from './Todos';
import { useSelector } from 'react-redux';
import Albums from './Albums';

function Writer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state: UserState) => state.user.data);

  const [writer, setWriter] = useState<WriterResponse | null>(null);
  const [tempWriter, setTempWriter] = useState<WriterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const getWriter = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/users/${id}`);
      const data = await response.json();
      setWriter(data);
      setTempWriter(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWriter = async () => {
    try {
      const response = await fetch(`${baseUrl}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(writer),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setWriter(await response.json());
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = () => {
    if (token) {
      if (String(user.id) === id) {
        return true;
      }
      return false;
    }
    return false;
  };

  const toggleIsEdit = () => {
    if (isEdit) {
      setIsEdit(false);
      setWriter(tempWriter);
    } else {
      setIsEdit(true);
    }
  };

  useEffect(() => {
    getWriter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="container mb-4">
        <h3>About Writer</h3>
        {isLoading ? (
          <h4>Loading...</h4>
        ) : !writer ? (
          <h4>Something went wrong</h4>
        ) : (
          <div className="card">
            <div className="card-body">
              {isEdit ? (
                <form className="mb-4">
                  <div className="form-group">
                    <p>Name: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.name}
                      onChange={(e) => setWriter({ ...writer, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <p>Username: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.username}
                      onChange={(e) => setWriter({ ...writer, username: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <p>email: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.email}
                      onChange={(e) => setWriter({ ...writer, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <p>phone: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.phone}
                      onChange={(e) => setWriter({ ...writer, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <p>website: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.website}
                      onChange={(e) => setWriter({ ...writer, website: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <p>Company: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.company.name}
                      onChange={(e) => setWriter({ ...writer, company: { ...writer.company, name: e.target.value } })}
                    />
                  </div>
                  <div className="form-group">
                    <p>Street: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.address.street}
                      onChange={(e) => setWriter({ ...writer, address: { ...writer.address, street: e.target.value } })}
                    />
                  </div>
                  <div className="form-group">
                    <p>Suite:</p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.address.suite}
                      onChange={(e) => setWriter({ ...writer, address: { ...writer.address, suite: e.target.value } })}
                    />
                  </div>
                  <div className="form-group">
                    <p>City: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.address.city}
                      onChange={(e) => setWriter({ ...writer, address: { ...writer.address, city: e.target.value } })}
                    />
                  </div>
                  <div className="form-group">
                    <p>Zipcode: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={writer.address.zipcode}
                      onChange={(e) =>
                        setWriter({ ...writer, address: { ...writer.address, zipcode: e.target.value } })
                      }
                    />
                  </div>
                </form>
              ) : (
                <div>
                  <p>Username: {writer.username}</p>
                  <p>Email: {writer.email}</p>
                  <p>Phone: {writer.phone}</p>
                  <p>Website: {writer.website}</p>
                  <p>Company: {writer.company.name}</p>
                  <p>
                    Address: {writer.address.street}, {writer.address.suite}, {writer.address.city},{' '}
                    {writer.address.zipcode}
                  </p>
                </div>
              )}

              <button onClick={() => navigate(-1)} className="btn btn-primary btn-sm me-2">
                Back
              </button>

              {isAuthenticated() && (
                <>
                  <button className="btn btn-warning btn-sm me-2" onClick={toggleIsEdit}>
                    {isEdit ? 'Cancel' : 'Edit'}
                  </button>
                  <button disabled={!isEdit} className="btn btn-danger btn-sm" onClick={updateWriter}>
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Posts userId={Number(id)} />
      {isAuthenticated() && <Albums userId={Number(id)} />}
      {isAuthenticated() && <Todos userId={Number(id)} />}
    </div>
  );
}

export default Writer;
