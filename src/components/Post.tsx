import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Post as PostResponse, UserState, baseUrl } from '../services/global';
import { useSelector } from 'react-redux';
import Comments from './Comments';

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, user } = useSelector((state: UserState) => state.user.data);

  const [post, setPost] = useState<PostResponse | null>(null);
  const [tempPost, setTempPost] = useState<PostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const getPost = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/posts/${id}`);
      const data = await response.json();
      setPost(data);
      setTempPost(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async () => {
    try {
      const response = await fetch(`${baseUrl}/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPost(await response.json());
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isAuthenticated = () => {
    if (token) {
      if (user.id === post?.userId) {
        return true;
      }
      return false;
    }
    return false;
  };

  const toggleIsEdit = () => {
    if (isEdit) {
      setIsEdit(false);
      setPost(tempPost);
      // console.log(tempPost);
    } else {
      setIsEdit(true);
    }
  };

  useEffect(() => {
    getPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        <h4>Loading...</h4>
      ) : !post ? (
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
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                  />
                </div>
                <div className="form-group mb-2">
                  <p>Body: </p>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={post.body}
                    onChange={(e) => setPost({ ...post, body: e.target.value })}
                  ></textarea>
                </div>
              </form>
            ) : (
              <div>
                <h6 className="card-title">{post.title}</h6>
                <p className="card-text">{post.body}</p>
                <p>
                  By:
                  <Link to={`/writers/${post.userId}`}> Writer {post.userId}</Link>
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
                <button disabled={!isEdit} onClick={updatePost} className="btn btn-danger btn-sm ms-2">
                  Update
                </button>
              </>
            )}

            <Comments />
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
