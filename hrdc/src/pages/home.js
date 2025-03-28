import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", text: "", image: null });
  const [editingIndex, setEditingIndex] = useState(null);

  const handlePost = () => {
    if (newPost.title.trim() || newPost.text.trim() || newPost.image) {
      if (editingIndex !== null) {
        // Update existing post
        const updatedPosts = [...posts];
        updatedPosts[editingIndex] = newPost;
        setPosts(updatedPosts);
        setEditingIndex(null);
      } else {
        // Add new post
        setPosts([...posts, newPost]);
      }

      setNewPost({ title: "", text: "", image: null });
      setShowForm(false);
    }
  };

  const handleEdit = (index) => {
    setNewPost(posts[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setPosts(posts.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* Header with Add Post Button */}
      <div className="flex justify-between items-center p-6 bg-green-700 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold">Community Events & Notices</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setNewPost({ title: "", text: "", image: null });
            setEditingIndex(null);
          }}
          className="text-3xl font-bold bg-white text-green-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-200"
        >
          +
        </button>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="p-6 bg-white shadow-md rounded-lg mx-4 my-4">
          <input
            type="text"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            className="w-full p-4 mt-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Write your post..."
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewPost({ ...newPost, image: URL.createObjectURL(e.target.files[0]) })
            }
            className="mt-4 block w-full text-sm text-gray-500"
          />
          <button
            onClick={handlePost}
            className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
          >
            {editingIndex !== null ? "Update Post" : "Post"}
          </button>
        </div>
      )}

      {/* Posts Section */}
      <div className="p-6 space-y-6 flex-grow">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No posts yet. Be the first to share!</p>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="p-6 bg-white shadow-md rounded-lg text-center relative">
              {post.image && (
                <Image
                  src={post.image}
                  alt="Post"
                  width={500}
                  height={300}
                  className="rounded-lg mb-4 mx-auto"
                />
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-lg text-gray-800">{post.text}</p>

              {/* Edit & Delete Buttons */}
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white text-center py-6 mt-6 shadow-lg">
        <p className="text-lg">&copy; 2025 HRDC, INC. ALL RIGHTS RESERVED</p>
        <Link href="/support" className="text-blue-400 underline text-lg hover:text-blue-300">
          Need Help? Visit Support
        </Link>
      </div>
    </div>
  );
}
