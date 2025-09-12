# Firestore Indexing Guide

This guide explains how to set up proper indexes for your Firestore database to improve query performance.

## 🚀 Quick Start

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Select Your Project
```bash
firebase use your-project-id
```

### 4. Deploy Indexes
```bash
node deploy-indexes.js
```

## 📊 Indexes Created

### Portfolio Items (`portfolioItems`)
- **Single field indexes:**
  - `createdAt` (descending) - For chronological listing
  - `slug` (ascending) - For finding by slug
  - `updatedAt` (descending) - For recent updates

- **Composite indexes:**
  - `title` + `createdAt` (descending) - For title-based searches with ordering
  - `tags` (array contains) + `createdAt` (descending) - For tag filtering with ordering

### Blog Posts (`blogPosts`)
- **Single field indexes:**
  - `createdAt` (descending) - For chronological listing
  - `slug` (ascending) - For finding by slug
  - `publishedAt` (descending) - For published posts

- **Composite indexes:**
  - `status` + `createdAt` (descending) - For status filtering with ordering
  - `status` + `publishedAt` (descending) - For published posts by status

### Announcements (`announcements`)
- **Single field indexes:**
  - `createdAt` (descending) - For chronological listing

- **Composite indexes:**
  - `isActive` + `createdAt` (descending) - For active announcements

### Testimonials (`testimonials`)
- **Single field indexes:**
  - `createdAt` (descending) - For chronological listing

- **Composite indexes:**
  - `isApproved` + `createdAt` (descending) - For approved testimonials

### Notifications (`notifications`)
- **Single field indexes:**
  - `createdAt` (descending) - For chronological listing

- **Composite indexes:**
  - `userId` + `createdAt` (descending) - For user-specific notifications
  - `isRead` + `createdAt` (descending) - For read/unread filtering

### AI Content (`aiContent`)
- **Single field indexes:**
  - `createdAt` (descending) - For chronological listing

- **Composite indexes:**
  - `contentType` + `createdAt` (descending) - For content type filtering

### Contact Messages (`contactMessages`)
- **Single field indexes:**
  - `submittedAt` (descending) - For chronological listing

- **Composite indexes:**
  - `isRead` + `submittedAt` (descending) - For read/unread filtering

### Visitor Sessions (`visitorSessions`)
- **Single field indexes:**
  - `createdAt` (descending) - For chronological listing

- **Composite indexes:**
  - `sessionId` + `createdAt` (descending) - For session-specific queries

## 🔧 Manual Index Creation

If you prefer to create indexes manually through the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Click on "Indexes" tab
5. Click "Create Index"
6. Add the fields and order as specified in `firestore.indexes.json`

## 📈 Performance Benefits

### Before Indexing
- Queries may be slow or fail
- Firestore may return "index required" errors
- Complex queries might timeout

### After Indexing
- ⚡ **Faster queries** - Up to 10x performance improvement
- 🎯 **Complex filtering** - Support for multiple field queries
- 📊 **Better sorting** - Efficient ordering by multiple fields
- 🔍 **Array searches** - Fast tag and category filtering

## 🚨 Common Issues

### "Index required" Error
If you see this error, it means you need to create an index for your query:
1. Check the error message for the required index
2. Add it to `firestore.indexes.json`
3. Deploy with `node deploy-indexes.js`

### Slow Queries
- Ensure you're using indexed fields in your queries
- Avoid querying on non-indexed fields
- Use composite indexes for multi-field queries

### Array Field Queries
For array fields like `tags`, use `array-contains`:
```javascript
query(collectionRef, where("tags", "array-contains", "react"))
```

## 🔄 Updating Indexes

When you add new queries to your application:

1. Identify the fields used in `where()` and `orderBy()` clauses
2. Add the corresponding index to `firestore.indexes.json`
3. Deploy with `node deploy-indexes.js`

## 📝 Best Practices

1. **Create indexes proactively** - Don't wait for errors
2. **Use composite indexes** - For queries with multiple fields
3. **Order matters** - Put equality filters before range filters
4. **Monitor usage** - Check Firebase Console for index usage stats
5. **Test queries** - Verify performance in development

## 🛠️ Troubleshooting

### Firebase CLI Issues
```bash
# Check if logged in
firebase login --reauth

# Check current project
firebase use

# List available projects
firebase projects:list
```

### Index Deployment Issues
```bash
# Check Firebase project status
firebase projects:list

# Verify project selection
firebase use your-project-id

# Deploy with verbose output
firebase deploy --only firestore:indexes --debug
```

## 📚 Additional Resources

- [Firestore Indexing Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firestore Query Optimization](https://firebase.google.com/docs/firestore/best-practices)

---

**Note:** Index creation can take several minutes. Monitor the Firebase Console for completion status.
