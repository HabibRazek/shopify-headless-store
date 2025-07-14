# Blog System Documentation

## Overview

This document describes the complete blog system implementation for the Packedin e-commerce website. The blog system includes a public blog interface, admin management dashboard, and comprehensive API endpoints.

## Features

### Public Features
- **Blog Homepage** (`/blog`) - Lists all published blog posts with pagination, search, and filtering
- **Individual Blog Posts** (`/blog/[slug]`) - Displays full blog post content with metadata
- **Category Filtering** - Filter posts by category
- **Search Functionality** - Search posts by title, content, category, and tags
- **RSS Feed** (`/blog/rss.xml`) - RSS feed for blog posts
- **SEO Optimization** - Automatic sitemap generation including blog posts

### Admin Features
- **Admin Dashboard** (`/admin`) - Central management interface
- **Post Management** (`/admin/blog/posts`) - Create, edit, delete, and manage blog posts
- **Category Management** (`/admin/blog/categories`) - Manage blog categories
- **Tag Management** (`/admin/blog/tags`) - Manage blog tags
- **Draft System** - Save posts as drafts before publishing
- **Rich Content** - Support for HTML content in blog posts
- **Image Upload** - Direct image upload with drag-and-drop support
- **Image Management** - Automatic file naming, validation, and storage

## Database Schema

### BlogPost
- `id` - Unique identifier
- `title` - Post title
- `slug` - URL-friendly identifier
- `excerpt` - Short description/summary
- `content` - Full post content (HTML supported)
- `featuredImage` - URL to featured image
- `published` - Publication status
- `views` - View counter
- `authorId` - Reference to User
- `categoryId` - Reference to BlogCategory (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### BlogCategory
- `id` - Unique identifier
- `name` - Category name
- `slug` - URL-friendly identifier
- `description` - Category description

### BlogTag
- `id` - Unique identifier
- `name` - Tag name
- `slug` - URL-friendly identifier

## Image Upload System

### Features
- **Drag & Drop Interface** - Intuitive drag-and-drop file upload
- **File Validation** - Automatic validation of file type and size
- **Supported Formats** - JPEG, PNG, WebP, GIF
- **Size Limit** - Maximum 5MB per image
- **Automatic Naming** - Timestamp-based unique filenames
- **Preview** - Real-time image preview with hover effects
- **Error Handling** - Comprehensive error messages in French

### File Storage
- **Location**: `/public/uploads/blog/`
- **Naming Convention**: `{timestamp}_{sanitized_filename}`
- **Public Access**: Images accessible via `/uploads/blog/{filename}`
- **Git Handling**: Directory structure tracked, uploaded files ignored

### Security
- **Authentication Required** - Only admin users can upload images
- **File Type Validation** - Server-side validation of MIME types
- **Size Restrictions** - 5MB maximum file size
- **Filename Sanitization** - Special characters removed from filenames

### Usage in Blog Posts
1. **Create/Edit Post** - Navigate to blog post creation/editing
2. **Upload Image** - Use the "Image à la une" section
3. **Drag & Drop** - Drag image files directly onto the upload area
4. **Browse Files** - Click "Browse Files" to select from file system
5. **Preview** - View uploaded image with hover effects
6. **Remove** - Click X button to remove uploaded image

## API Endpoints

### Public Endpoints

#### GET /api/blog/posts
Get published blog posts with pagination and filtering.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 10)
- `category` - Filter by category slug
- `tag` - Filter by tag slug
- `search` - Search query

**Response:**
```json
{
  "posts": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### GET /api/blog/posts/[slug]
Get a single blog post by slug. Automatically increments view count.

#### GET /api/blog/categories
Get all blog categories with post counts.

#### GET /api/blog/tags
Get all blog tags with post counts.

#### GET /api/blog/search
Search blog posts.

**Query Parameters:**
- `q` - Search query (minimum 2 characters)
- `limit` - Results limit (default: 10)

### Admin Endpoints (Requires admin role)

#### POST /api/blog/posts
Create a new blog post.

#### PUT /api/blog/posts/[slug]
Update an existing blog post.

#### DELETE /api/blog/posts/[slug]
Delete a blog post.

#### GET /api/admin/blog/posts
Get all blog posts (including unpublished) for admin management.

#### POST /api/blog/categories
Create a new category.

#### PUT /api/blog/categories/[id]
Update a category.

#### DELETE /api/blog/categories/[id]
Delete a category (only if no posts are assigned).

#### POST /api/blog/tags
Create a new tag.

#### PUT /api/blog/tags/[id]
Update a tag.

#### DELETE /api/blog/tags/[id]
Delete a tag.

#### POST /api/upload/image
Upload an image file for blog posts.

**Request:** FormData with 'file' field containing the image
**Response:**
```json
{
  "success": true,
  "url": "/uploads/blog/1234567890_image.jpg",
  "filename": "1234567890_image.jpg",
  "size": 123456,
  "type": "image/jpeg",
  "message": "Image téléchargée avec succès"
}
```

## Admin Access

### Creating an Admin User
An admin user has been created with the following credentials:
- **Email:** admin@packedin.tn
- **Password:** admin123
- **Role:** admin

### Admin Navigation
Admin users will see an "Administration" link in their user dropdown menu, providing access to:
- Blog post management
- Category management
- Tag management
- General admin dashboard

## Components

### BlogWidget
A homepage widget that displays the 3 most recent blog posts. Automatically included on the homepage.

### Blog Pages
- `app/blog/page.tsx` - Main blog listing page
- `app/blog/[slug]/page.tsx` - Individual blog post page

### Admin Pages
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/blog/posts/page.tsx` - Post management
- `app/admin/blog/posts/new/page.tsx` - Create new post
- `app/admin/blog/posts/[slug]/edit/page.tsx` - Edit existing post
- `app/admin/blog/categories/page.tsx` - Category management
- `app/admin/blog/tags/page.tsx` - Tag management

## Seeded Data

The system includes sample data:

### Categories
- Actualités
- Conseils
- Innovation
- Événements

### Tags
- Emballage
- Doypack
- Écologique
- Innovation
- Alimentaire
- Cosmétique
- Personnalisation
- Qualité
- Salon
- Tendances

### Sample Posts
- "Notre participation au salon international Gulfood Manufacturing 2023 à Dubaï"
- "Le Guide Complet de l'Emballage Flexible"
- "Sustainability & Flexible Packaging : L'engagement de Packedin pour un avenir plus vert"

## SEO Features

### Sitemap
Blog posts are automatically included in the sitemap (`/sitemap.xml`) with:
- Individual post URLs
- Last modified dates
- Appropriate priority and change frequency

### RSS Feed
Available at `/blog/rss.xml` with:
- Latest 20 published posts
- Full content and metadata
- Proper RSS 2.0 format

### Meta Tags
Each blog post page includes appropriate meta tags for SEO and social sharing.

## Usage Instructions

### For Content Creators
1. Log in with admin credentials
2. Navigate to Admin → Blog Management
3. Click "Nouvel article" to create a new post
4. Fill in title, content, category, and tags
5. Save as draft or publish immediately
6. Use the post management interface to edit or delete posts

### For Developers
The blog system is fully integrated with the existing authentication and UI systems. All components use the established design system and are responsive.

## Future Enhancements

Potential improvements could include:
- Rich text editor (WYSIWYG)
- Image upload functionality
- Comment system
- Social sharing buttons
- Related posts suggestions
- Email newsletter integration
- Advanced analytics
- Multi-language support
