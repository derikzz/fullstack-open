const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

describe.only('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog has id identifier', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert(blogs[0].hasOwnProperty('id') && !blogs[1].hasOwnProperty('_id')) 
  })

  test('blog is updated', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogToChange = { ...blogsBefore[0], likes: 100 }

    await api
      .put(`/api/blogs/${blogToChange.id}`)
      .send(blogToChange)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter[0].likes, 100)
  })
})

describe.only('when we are adding a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
  })

  test('blog is added correctly', async () => {
    const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
      }  

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAfter = await helper.blogsInDb()
    const titles = blogsAfter.map(e => e.title)
    assert.strictEqual(blogsAfter.length, 1)
    assert(titles.includes('Type wars'))
  })

  test('blog like count defaults to 0', async () => {
    const newBlog = {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter[0].likes, 0)
  })

  test('responds with bad request if title is missing', async () => {
    const newBlog = {
      _id: "5a422bc61b54a676234d17fc",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(404)
  })

  test('responds with bad request if url is missing', async () => {
    const newBlog = {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(404)
  })
})

describe.only('when we are deleting a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blog is deleted', async () => {
    const blogsToView = await helper.blogsInDb()
    const blogToDelete = blogsToView[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})