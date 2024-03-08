import { useEffect, useState } from 'react';
import { Post, UserState, baseUrl } from '../services/global';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { summary } from '../services/helper';

function Posts({ userId }: { userId: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const { token, user } = useSelector((state: UserState) => state.user.data);

  // Pagination controls
  const itemsPerPage = 8;
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = posts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(posts.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % posts.length;
    setItemOffset(newOffset);
  };

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = userId ? await fetch(`${baseUrl}/users/${userId}/posts`) : await fetch(`${baseUrl}/posts`);
      setPosts(await response.json());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addPost = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/posts/`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          body,
          userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPosts([await response.json(), ...posts]);
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
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container posts">
      <div className="d-flex gap-2 align-items-center mb-2">
        <h3>Posts</h3>
        {isAuthenticated() && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsAdd(!isAdd)}>
            {isAdd ? 'Cancel' : '+ Add Post'}
          </button>
        )}
      </div>
      {isAuthenticated() && isAdd && (
        <form onSubmit={addPost}>
          <div className="form-group mb-2">
            <p>Title: </p>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group mb-2">
            <p>Body: </p>
            <textarea
              className="form-control"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
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
        ) : !posts.length ? (
          <h4>No posts yet</h4>
        ) : (
          <>
            {currentItems.map((post: Post) => (
              <div className="col-md-3" key={post.id}>
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">{summary(post.title, 20)}</h6>
                    <p>
                      By:
                      <Link to={`/writers/${post.userId}`}> Writer {post.userId}</Link>
                    </p>
                    <Link to={`/posts/${post.id}`} className="btn btn-primary btn-sm">
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

export default Posts;
