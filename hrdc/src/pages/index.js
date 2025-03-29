import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { isAdmin } from "./api/user-management";
import { createPost, getPosts, updatePost, deletePost } from "./api/posts-management";
import Navbar from "../components/Navbar";

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
          text: newPost.text,
          date: new Date().toISOString() 
        });

        // Refresh posts
        const updatedPosts = await getPosts();
        setPosts(updatedPosts);
      } else {
        // Create new post
        const createdPost = await createPost(
          {
            title: newPost.title,
            text: newPost.text,
            date: new Date().toISOString()
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
      text: post.text,
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
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/hrdc.png"
          alt="Filing Cabinets"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/60 w-[550px] h-[150px] flex items-center justify-center">
            <h1 className="text-[44px] font-bold text-black"
              style={{ fontFamily: '"Gotham", Helvetica' }}
            >
              ANNOUNCEMENTS
            </h1>
          </div>
        </div>
      </div>


      {/* Random Comment Remove Me */}

      {/* Admin-only "Create Document" button */}
      {isUserAdmin && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 bg-green-700 text-white rounded-full w-16 h-16 text-3xl flex items-center justify-center shadow-lg hover:bg-green-800 transition duration-200"
          title="Create Document"
        >
          +
        </button>
      )}

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
          <button
            onClick={handlePost}
            className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
          >
            {editingPost !== null ? "Update Post" : "Post"}
          </button>
        </div>
      )}

      {/* Posts */}
      <div className="p-6 space-y-6 flex-grow">
        {posts.map((post) => (
          <div key={post.id} className="p-6 bg-white shadow-lg rounded-lg border border-gray-300">
            <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-300 w-full max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-green-800">{post.title}</h2>
              <p className="text-gray-500 text-sm mt-1">
  {post.createdAt ? new Date(post.createdAt.toDate()).toLocaleDateString() : "Date unavailable"}
</p>


              <hr className="my-4 border-t-2 border-gray-300 w-3/4 mx-auto" />
              <p className="text-gray-800 text-lg leading-relaxed">{post.text}</p>

              {isUserAdmin && (
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
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
