import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Album as AlbumResponse, UserState, baseUrl } from '../services/global';
import { useSelector } from 'react-redux';
import Photos from './Photos';

function Album() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, user } = useSelector((state: UserState) => state.user.data);

  const [album, setAlbum] = useState<AlbumResponse | null>(null);
  const [tempAlbum, setTempAlbum] = useState<AlbumResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const getAlbum = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/albums/${id}`);
      const data = await response.json();
      setAlbum(data);
      setTempAlbum(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAlbum = async () => {
    try {
      const response = await fetch(`${baseUrl}/albums/${id}`, {
        method: 'PUT',
        body: JSON.stringify(album),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAlbum(await response.json());
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = () => {
    if (token) {
      if (user.id === album?.userId) {
        return true;
      }
      return false;
    }
    return false;
  };

  const toggleIsEdit = () => {
    if (isEdit) {
      setIsEdit(false);
      setAlbum(tempAlbum);
    } else {
      setIsEdit(true);
    }
  };

  useEffect(() => {
    getAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <h4>Loading...</h4>
      ) : !album ? (
        <h4>Something went wrong</h4>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-body">
              {isEdit ? (
                <form>
                  <div className="form-group mb-2">
                    <p>Title: </p>
                    <input
                      type="text"
                      className="form-control"
                      value={album.title}
                      onChange={(e) => setAlbum({ ...album, title: e.target.value })}
                    />
                  </div>
                </form>
              ) : (
                <div>
                  <h6 className="card-title">{album.title}</h6>
                  <p>
                    By:
                    <Link to={`/writers/${album.userId}`}> Writer {album.userId}</Link>
                  </p>
                </div>
              )}

              <button onClick={() => navigate(-1)} className="btn btn-primary btn-sm">
                Back
              </button>

              {isAuthenticated() && (
                <>
                  <button onClick={toggleIsEdit} className="btn btn-warning btn-sm ms-2">
                    {isEdit ? 'Cancel' : 'Edit'}
                  </button>
                  <button disabled={!isEdit} onClick={updateAlbum} className="btn btn-danger btn-sm ms-2">
                    Update
                  </button>
                </>
              )}
            </div>
          </div>

          <Photos albumId={Number(id)} />
        </>
      )}
    </div>
  );
}

export default Album;
