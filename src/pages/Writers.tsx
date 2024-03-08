import { useEffect, useState } from 'react';
import { User, baseUrl } from '../services/global';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';

function Writers() {
  const [writers, setWriters] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination controls
  const itemsPerPage = 8;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = writers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(writers.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % writers.length;
    setItemOffset(newOffset);
  };

  const getWriters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/users`);
      setWriters(await response.json());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWriters();
  }, []);

  return (
    <div className="container writers">
      <h3>Writers</h3>
      <div className="row">
        {isLoading ? (
          <h4>Loading...</h4>
        ) : !writers.length ? (
          <h4>No writers yet</h4>
        ) : (
          <>
            {currentItems.map((writer: User) => (
              <div className="col-md-3" key={writer.id}>
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">{writer.username}</h6>
                    <p>Email: {writer.email}</p>
                    <Link to={`/writers/${writer.id}`} className="btn btn-primary btn-sm">
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

export default Writers;
