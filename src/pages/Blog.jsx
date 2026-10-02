import './Blog.css'
import { Link } from 'react-router-dom'
import { posts } from '../data/posts'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Blog() {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <main className="blog">
      <h1>From the OddsIQ blog</h1>
      <p className="blog__intro">
        Notes on how we grade picks, what the numbers mean, and how to use them.
      </p>

      <div className="blog__list">
        {sorted.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="blog__post">
            <span className="blog__post-date">{formatDate(post.date)}</span>
            <h2 className="blog__post-title">{post.title}</h2>
            <p className="blog__post-excerpt">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Blog
