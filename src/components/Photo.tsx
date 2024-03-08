import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Photo as PhotoResponse, UserState, baseUrl } from '../services/global';
import { useSelector } from 'react-redux';

function Photo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token } = useSelector((state: UserState) => state.user.data);

  const [photo, setPhoto] = useState<PhotoResponse | null>(null);
  const [tempPhoto, setTempPhoto] = useState<PhotoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const getPhoto = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/photos/${id}`);
      const data = await response.json();
      setPhoto(data);
      setTempPhoto(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePhoto = async () => {
    try {
      const response = await fetch(`${baseUrl}/photos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(photo),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPhoto(await response.json());
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = () => {
    if (token) {
      return true;
    }
    return false;
  };

  const toggleIsEdit = () => {
    if (isEdit) {
      setIsEdit(false);
      setPhoto(tempPhoto);
    } else {
      setIsEdit(true);
    }
  };

  useEffect(() => {
    getPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <h4>Loading...</h4>
      ) : !photo ? (
        <h4>Something went wrong</h4>
      ) : (
        <div className="card">
          <div className="card-body">
            {isEdit ? (
              <form>
                <div className="form-group mb-2">
                  <p>Title: </p>
                  <input
                    type="text"
                    className="form-control"
                    value={photo.title}
                    onChange={(e) => setPhoto({ ...photo, title: e.target.value })}
                  />
                </div>
              </form>
            ) : (
              <div>
                <img src={photo.url} alt="photo" />
                <h6 className="card-title">{photo.title}</h6>
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
                <button disabled={!isEdit} onClick={updatePhoto} className="btn btn-danger btn-sm ms-2">
                  Update
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Photo;
