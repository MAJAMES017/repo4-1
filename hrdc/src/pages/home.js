import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      date: new Date().toISOString().split('T')[0], // Default date as today's date
      title: "HRDC intranet Browser Launches",
      description: "After partnering with students from MSU, The HRDC has launched its official Intranet Site! Here, you can access internal files, view upcoming events, and complete your timesheets!",
      image: "../../images/hrdc.png"
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Default date
    image: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: file });
      setPreviewImage(URL.createObjectURL(file)); // Preview uploaded image
    }
  };

  const addPost = () => {
    if (newPost.title && newPost.description && newPost.date && newPost.image) {
      const postWithImageURL = {
        ...newPost,
        image: previewImage // Use the preview image URL
      };
      setPosts([postWithImageURL, ...posts]);
      setNewPost({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0], // Reset to today's date
        image: null
      });
      setPreviewImage(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Massively by HTML5 UP</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      </Head>

      {/* Intro */}
      <div id="intro">
        <h1>The HRDC<br /> Intranet Browser</h1>
        <p>The hub for all things 
          <a href="http://localhost:3000/home"> News</a>,
          <a href="http://localhost:3000/"> Files</a><br /> and
          <a href="http://localhost:3000/"> Timesheets!</a><br />
        </p>
        <ul className="actions">
          <li><a href="#header" className="button icon solid solo fa-arrow-down scrolly">Continue</a></li>
        </ul>
      </div>

      {/* Nav */}
      <nav id="nav">
        <ul className="links">
          <li className="active"><Link href="/">News</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div id="main">
        <button onClick={() => setIsModalOpen(true)} 
                style={{ margin: '20px', fontSize: '24px', padding: '10px', cursor: 'pointer', 
                gap: '8px', justifyContent: 'center', alignItems: 'center',
                boxShadow: 'none'}}>➕ Add Post</button>

        {/* Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '5px', width: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h2>Add a New Post</h2>
              <input type="text" name="title" placeholder="Title" value={newPost.title} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }} />
              <textarea name="description" placeholder="Description" value={newPost.description} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }} />
              <input type="date" name="date" value={newPost.date} onChange={handleChange} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }} />
              
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }} />
              {previewImage && <img src={previewImage} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />}

              <button onClick={addPost} style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}>Publish</button>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Posts */}
        {posts.map((post, index) => (
          <article className="post featured" key={index}>
            <header className="major">
              <span className="date">{post.date}</span>
              <h2><a href="/">{post.title}</a></h2>
              <p>{post.description}</p>
            </header>
            {post.image && (
              <a href="/" className="image main">
                <Image src={post.image} alt="" width={800} height={450} unoptimized />
              </a>
            )}
          </article>
        ))}
      </div>

      {/* Footer */}
      <footer id="footer">
        <section>
          <form method="post" action="#">
            <div className="fields">
            <div className="field">
                <label htmlFor="name">Have any issues with the site? Send a ticket!</label>
              </div>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="text" name="email" id="email" />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" rows="3"></textarea>
              </div>
            </div>
            <ul className="actions">
              <li><input type="submit" value="Send Message" /></li>
            </ul>
          </form>
        </section>
      </footer>

      {/* Copyright */}
      <div id="copyright">
        <ul>
          <li>Design: <a href="https://html5up.net">HTML5 UP</a></li>
        </ul>
      </div>
    </div>
  );
}

