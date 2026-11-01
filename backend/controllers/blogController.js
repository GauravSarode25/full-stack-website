import { storage } from '../data/storage.js';

// @desc    Get all blog posts with search, category & featured filtering
// @route   GET /api/blogs
// @query   ?search=keyword&category=Dating&featured=true
export const getBlogPosts = (req, res) => {
  try {
    let posts = storage.getBlogPosts();
    const { search, category, featured } = req.query;

    // Filter by category
    if (category && category !== 'All') {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter featured
    if (featured === 'true') {
      posts = posts.filter((p) => p.featured === true);
    }

    // Search by title, excerpt, tags, or content
    if (search) {
      const query = search.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(query))) ||
          (p.content && p.content.toLowerCase().includes(query))
      );
    }

    // Extract unique categories for filter UI
    const allPosts = storage.getBlogPosts();
    const categories = [...new Set(allPosts.map((p) => p.category))];

    res.json({
      success: true,
      count: posts.length,
      categories,
      data: posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog post by slug or ID
// @route   GET /api/blogs/:slug
export const getBlogPostBySlug = (req, res) => {
  try {
    const post = storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Get related posts from the same category (excluding current)
    const allPosts = storage.getBlogPosts();
    const relatedPosts = allPosts
      .filter((p) => p.category === post.category && p.id !== post.id)
      .slice(0, 3);

    res.json({
      success: true,
      data: post,
      relatedPosts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog post (Admin)
// @route   POST /api/blogs
export const createBlogPost = (req, res) => {
  try {
    const { title, excerpt, content, category, author, readTime, coverImage, tags, isPublished } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Blog post title is required' });
    }
    const newPost = storage.addBlogPost({
      title: title.trim(),
      excerpt,
      content,
      category,
      author,
      readTime,
      coverImage,
      tags,
      isPublished: isPublished !== undefined ? isPublished : true
    });
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: newPost
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog post (Admin)
// @route   PUT /api/blogs/:id
export const updateBlogPost = (req, res) => {
  try {
    const updated = storage.updateBlogPost(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog post (Admin)
// @route   DELETE /api/blogs/:id
export const deleteBlogPost = (req, res) => {
  try {
    const deleted = storage.deleteBlogPost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({
      success: true,
      message: 'Blog post deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle publish / unpublish blog post (Admin)
// @route   PATCH /api/blogs/:id/publish
export const togglePublishBlog = (req, res) => {
  try {
    const toggled = storage.togglePublishBlogPost(req.params.id);
    if (!toggled) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({
      success: true,
      message: `Blog post is now ${toggled.isPublished ? 'Published' : 'Draft'}`,
      data: toggled
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
