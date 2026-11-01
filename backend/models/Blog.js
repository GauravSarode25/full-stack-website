import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    image: {
      type: String,
      required: [true, 'Cover image URL is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Dating & Lifestyle',
        'Food Guide',
        'Café Culture',
        'Experiences',
        'Friendship',
        'Tips & Etiquette'
      ]
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    authorRole: {
      type: String,
      default: 'Cafe Love Byte Team'
    },
    readTime: {
      type: String,
      default: '4 min read'
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    featured: {
      type: Boolean,
      default: false
    },
    isDemoContent: {
      type: Boolean,
      default: true
    },
    tags: [String]
  },
  {
    timestamps: true
  }
);

// Generate slug from title before validation
blogSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Add text index for search
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
