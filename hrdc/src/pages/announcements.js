"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { isAdmin } from "./api/user-management";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "./api/posts-management";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", text: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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
        await updatePost(editingPost.id, {
          title: newPost.title,
          text: newPost.text,
        });
        const updatedPosts = await getPosts();
        setPosts(updatedPosts);
      } else {
        const createdPost = await createPost(
          {
            title: newPost.title,
            text: newPost.text,
          },
          currentUser.uid
        );
        setPosts([createdPost, ...posts]);
      }

      setNewPost({ title: "", text: "" });
      setEditingPost(null);
      setShowForm(false);
    } catch (error) {
      alert("Failed to create/update post");
    }
  };

  const handleEdit = (post) => {
    setNewPost({ title: post.title, text: post.text });
    setEditingPost(post);
    setShowForm(true);
  };

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
    <div className="element-light min-h-screen flex flex-col">

      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/announce-banner.jpg"
          alt="Announcements Background"
          fill
          className="banner-image"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/60 w-[550px] h-[150px] flex items-center justify-center">
            <h1
              className="text-[44px] font-bold text-black"
              style={{ fontFamily: '"Gotham", Helvetica' }}
            >
              ANNOUNCEMENTS
            </h1>
          </div>
        </div>
      </div>

      {isUserAdmin && showForm && (
        <div className="max-w-3xl mx-auto px-6 py-8 bg-white shadow-md rounded-lg mt-8">
          <input
            type="text"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost({ ...newPost, title: e.target.value })
            }
          />
          <textarea
            className="w-full p-4 mt-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Write your post..."
            value={newPost.text}
            onChange={(e) =>
              setNewPost({ ...newPost, text: e.target.value })
            }
          ></textarea>
          <button
            onClick={handlePost}
            className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800"
          >
            {editingPost !== null ? "Update Post" : "Post"}
          </button>
        </div>
      )}

      <div className="w-4/5 mx-auto py-12 space-y-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-[var(--primary)] text-white px-6 py-4 relative flex items-center">
              <div className="flex items-center space-x-4 z-10">
                <div className="bg-white text-[var(--primary)] rounded-full p-2">
                  <Image src="/person.svg" alt="Author" width={32} height={32} />
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-sm">KRISTA</p>
                  <p className="text-xs">Administrator</p>
                  <p className="text-xs text-white/70">March 23rd, 2025</p>
                </div>
              </div>

              <h2 className="absolute left-1/2 transform -translate-x-1/2 text-[32px] font-bold text-white text-center w-full pointer-events-none">
                {post.title}
              </h2>
            </div>

            <div className="px-6 py-6 space-y-4">
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>DETAILS</strong></p>
                <p>{post.text}</p>

                {post.title.toLowerCase().includes("meeting") && (
                  <div className="mt-4">
                    <p><strong>WHERE AND WHEN</strong></p>
                    <p>Wednesday, April 23, 2025<br />9:00 AM – 12:00 PM MDT</p>
                    <p>
                      HRDC Bozeman Office, 32 S. Tracy Ave., Bozeman, MT 59715<br />
                      (with virtual option available via Zoom)
                    </p>
                    <button className="mt-4 px-6 py-2 bg-[var(--secondary-gold)] text-white font-semibold rounded hover:bg-[var(--secondary-blue)]">
                      SEE CALENDAR
                    </button>
                  </div>
                )}
              </div>

              {isUserAdmin && (
                <div className="flex space-x-2 mt-6">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-sm px-3 py-1 rounded bg-[var(--primary)] text-white hover:opacity-80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-sm px-3 py-1 rounded bg-[var(--dropdown-orange)] text-white hover:opacity-80"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
