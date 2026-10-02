import './BlogPost.css'
import { useParams, Link } from 'react-router-dom'
import { posts } from '../data/posts'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <main className="blog-post">
        <h1>Post not found</h1>
        <Link to="/blog">Back to blog</Link>
      </main>
    )
  }

  const paragraphs = post.content.trim().split('\n\n')

  return (
    <main className="blog-post">
      <Link to="/blog" className="blog-post__back">← Back to blog</Link>
      <span className="blog-post__date">{formatDate(post.date)}</span>
      <h1>{post.title}</h1>

      <div className="blog-post__body">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  )
}

export default BlogPost
