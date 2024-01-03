// Example of creating a new document
const newPost = new PostMessage({
    title: 'Sample Title',
    subtitle: 'Sample Subtitle',
    author: 'John Doe',
    category: 'Technology',
  });
  
  newPost.save(); // Save the new post to the MongoDB collection
  