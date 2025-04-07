const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blogToPost = request.body
  const user = await request.user
  
  if(!blogToPost.title || !blogToPost.url) {
    response.status(404).end()
  } else if(!blogToPost.likes) {
    blogToPost.likes = 0
  }
  
  blogToPost.user = user._id

  const blog = new Blog(blogToPost)

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = await request.user
  console.log(blog.user.id)
  if(blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  
  response.status(401).end()
})

blogsRouter.put('/:id', async (request, response) => {
  console.log(request.body)
  const likes = request.body.likes
  
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter