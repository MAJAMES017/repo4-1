import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { isAdmin } from "./api/user-management";
import { createPost, getPosts, updatePost, deletePost } from "./api/posts-management";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", text: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

    // Fetch posts and check admin status
    useEffect(() => {
      const fetchPostsAndCheckAdmin = async () => {
        try {
          setLoading(true);
          const fetchedPosts = await getPosts();
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const adminStatus = await isAdmin(user.uid);
            setCurrentUser(user);
            setIsUserAdmin(adminStatus);
          } catch (error) {
            console.error("Error checking admin status:", error);
            setIsUserAdmin(false);
          }
        } else {
          setCurrentUser(null);
          setIsUserAdmin(false);
        }

        fetchPostsAndCheckAdmin();
      });

      return () => unsubscribe();
    }, []);

    // Handle post submission
    const handlePost = async () => {
      if (!isUserAdmin) {
        alert("Only admins can create posts!");
        return;
      }

      if (!newPost.title.trim() && !newPost.text.trim()) {
        alert("Please enter post content");
        return;
      }

      try {
        if (editingPost) {
          // Update existing post
          await updatePost(editingPost.id, {
            title: newPost.title,
            text: newPost.text
          });

          // Refresh posts
          const updatedPosts = await getPosts();
          setPosts(updatedPosts);
        } else {
          // Create new post
          const createdPost = await createPost(
              {
                title: newPost.title,
                text: newPost.text
              },
              currentUser.uid
          );
          setPosts([createdPost, ...posts]);
        }

        // Reset form
        setNewPost({ title: "", text: "" });
        setEditingPost(null);
        setShowForm(false);
      } catch (error) {
        alert("Failed to create/update post");
      }
    };

    // Handle post edit
  const handleEdit = (post) => {
    setNewPost({
      title: post.title,
      text: post.text
    });
    setEditingPost(post);
    setShowForm(true);
  };

// Handle post deletion
  const handleDelete = async (postId) => {
    if (!isUserAdmin) {
      alert("Only admins can delete posts!");
      return;
    }

    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  return (
      <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
        <div className="flex justify-between items-center p-6 bg-green-700 text-white shadow-lg">
          <div>
            <Link href="/">
              <Image
                  src="/horizontal-1-color-HRDC-logo.svg"
                  alt="HRDC Logo"
                  width={160}
                  height={200}
                  className="cursor-pointer"
                  priority
              />
            </Link>
          </div>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-extrabold">Community Events & Notices</h1>
          {isUserAdmin && (
              <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setNewPost({title: "", text: "", image: null});
                    setEditingPost(null);
                  }}
                  className="text-3xl font-bold bg-white text-green-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-200"
              >
                +
              </button>
          )}
        </div>


        {showForm && (
            <div className="p-6 bg-white shadow-md rounded-lg mx-4 my-4">
              <input
                  type="text"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
              <textarea
                  className="w-full p-4 mt-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Write your post..."
                  value={newPost.text}
                  onChange={(e) => setNewPost({...newPost, text: e.target.value})}
              ></textarea>
              <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                      setNewPost({...newPost, image: URL.createObjectURL(e.target.files[0])})
                  }
                  className="mt-4 block w-full text-sm text-gray-500"
              />
              <button
                  onClick={handlePost}
                  className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
              >
                {editingPost !== null ? "Update Post" : "Post"}
              </button>
            </div>
        )}


        <div className="p-6 space-y-6 flex-grow">
          {posts.map((post) => (
              <div key={post.id} className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h2 className="text-xl font-bold">{post.title}</h2>
                    <p className="mt-2">{post.text}</p>
                  </div>
                  {isUserAdmin && (
                      <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(post)}
                            className="text-sm px-3 py-1 rounded hover:opacity-80"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "var(--whitebg-color)",
                            }}
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleDelete(post.id)}
                            className="text-sm px-3 py-1 rounded hover:opacity-80"
                            style={{
                              backgroundColor: "var(--dropdown-orange)",
                              color: "var(--whitebg-color)",
                            }}
                        >
                          Delete
                        </button>
                      </div>
                  )}
                </div>
              </div>
          ))}
        </div>


        <div className="bg-gray-900 text-white text-center py-6 mt-6 shadow-lg">
          <p className="text-lg">&copy; 2025 HRDC, INC. ALL RIGHTS RESERVED</p>
          <Link href="/support" className="text-blue-400 underline text-lg hover:text-blue-300">
            Need Help? Visit Support
          </Link>
        </div>
      </div>
  );
}
