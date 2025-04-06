const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, curr) => {
    return accumulator + curr.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null

  return blogs.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) return null

  const authors = {}

  blogs.forEach(blog => {
    if(authors[blog.author]) {
      authors[blog.author]++
    } else {
      authors[blog.author] = 1
    }
  });

  let max_author = { author: "", blogs: 0 }
  for(const author in authors) {
    max_author = max_author.blogs > authors[author] ? max_author : { author: author, blogs: authors[author] }
  }

  return max_author
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) return null
  
  const authors = {}

  blogs.forEach(blog => {
    if(authors[blog.author]) {
      authors[blog.author] += blog.likes
    } else {
      authors[blog.author] = blog.likes
    }
  })

  let max_author = { author: "", likes: -1 }
  for(const author in authors) {
    max_author = max_author.likes > authors[author] ? max_author : { author: author, likes: authors[author] }
  }

  return max_author
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}