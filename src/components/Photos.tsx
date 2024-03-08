import { useEffect, useState } from 'react';
import { Photo, UserState, baseUrl } from '../services/global';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { summary } from '../services/helper';

function Photos({ albumId }: { albumId: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const { token, user } = useSelector((state: UserState) => state.user.data);

  // Pagination controls
  const itemsPerPage = 8;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = photos.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(photos.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % photos.length;
    setItemOffset(newOffset);
  };

  const getPhotos = async () => {
    setIsLoading(true);
    try {
      const response = albumId ? await fetch(`${baseUrl}/albums/${albumId}/photos`) : await fetch(`${baseUrl}/photos`);
      setPhotos(await response.json());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addPhoto = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/photos/`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          userId: albumId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPhotos([await response.json(), ...photos]);
      setIsAdd(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = () => {
    if (token) {
      if (user.id === albumId) {
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    getPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container albums">
      <div className="d-flex gap-2 align-items-center mb-2">
        <h3>Photos</h3>
        {isAuthenticated() && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsAdd(!isAdd)}>
            {isAdd ? 'Cancel' : '+ Add Album'}
          </button>
        )}
      </div>
      {isAuthenticated() && isAdd && (
        <form onSubmit={addPhoto}>
          <div className="form-group mb-2">
            <p>Title: </p>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      )}
      <div className="row">
        {isLoading ? (
          <h4>Loading...</h4>
        ) : !photos.length ? (
          <h4>No album yet</h4>
        ) : (
          <>
            {currentItems.map((photo: Photo) => (
              <div className="col-md-3" key={photo.id}>
                <div className="card">
                  <img src={photo.thumbnailUrl} className="card-img-top" alt="album photo" />
                  <div className="card-body">
                    <h6 className="card-title">{summary(photo.title, 20)}</h6>
                    <Link to={`/photos/${photo.id}`} className="btn btn-primary btn-sm">
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-center">
              <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Photos;
