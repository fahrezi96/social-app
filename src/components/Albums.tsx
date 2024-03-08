import { useEffect, useState } from 'react';
import { Album, UserState, baseUrl } from '../services/global';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { summary } from '../services/helper';

function Albums({ userId }: { userId: number }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const { token, user } = useSelector((state: UserState) => state.user.data);

  // Pagination controls
  const itemsPerPage = 8;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = albums.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(albums.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % albums.length;
    setItemOffset(newOffset);
  };

  const getAlbums = async () => {
    setIsLoading(true);
    try {
      const response = userId ? await fetch(`${baseUrl}/users/${userId}/albums`) : await fetch(`${baseUrl}/albums`);
      setAlbums(await response.json());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addAlbum = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/albums/`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAlbums([await response.json(), ...albums]);
      setIsAdd(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = () => {
    if (token) {
      if (user.id === userId) {
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    getAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container albums">
      <div className="d-flex gap-2 align-items-center mb-2">
        <h3>Albums</h3>
        {isAuthenticated() && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsAdd(!isAdd)}>
            {isAdd ? 'Cancel' : '+ Add Album'}
          </button>
        )}
      </div>
      {isAuthenticated() && isAdd && (
        <form onSubmit={addAlbum}>
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
        ) : !albums.length ? (
          <h4>No album yet</h4>
        ) : (
          <>
            {currentItems.map((album: Album) => (
              <div className="col-md-3" key={album.id}>
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">{summary(album.title, 20)}</h6>
                    <p>
                      By:
                      <Link to={`/writers/${album.userId}`}> Writer {album.userId}</Link>
                    </p>
                    <Link to={`/albums/${album.id}`} className="btn btn-primary btn-sm">
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

export default Albums;
