import Post from '../../../../db/model/postmodel.js';


export const addPost = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, description, category, imgs, cover, shortTitle, shortDisc, deliveryTime, requiremnets, attachments } = req.body;
    console.log({ title, description, category, imgs, cover, shortTitle, shortDisc, deliveryTime, requiremnets })
    if (!title || !description || !category || !shortTitle || !shortDisc || !deliveryTime || !requiremnets) {
      res.status(400).json({ "msg": "Please fill all fields!" });
    }
    else {
      // Create a new post instance with extracted data
      const newPost = new Post({
        title,
        description,
        category,
        shortTitle,
        shortDisc,
        deliveryTime,
        requiremnets,
        owner: req.id
      });

      // Save the new post to the database
      await newPost.save();

      // Send a response indicating successful creation
      res.status(201).json(newPost);
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getOwnPosts = async (req, res) => {
  try {
    // Fetch posts created by the authenticated user (owner)
    const posts = await Post.find({ owner: req.id });

    // Send the posts as a response
    res.status(200).json(posts);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const deletePosts = async (req, res) => {
  try {
    // Extract post ID from request parameters
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    // Check if the authenticated user is the owner of the post
    if (!post.owner.equals(req.id)) {
      return res.status(403).json({ message: 'You can delete your own posts only!' });
    }

    // If the user is the owner, delete the post
    await Post.deleteOne({ _id: postId });

    // Send a response indicating successful deletion
    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const filterPosts = async (req, res) => {
  try {
    // Extracting filter parameters from the request
    const filters = req.query;
    // console.log(filters);

    // Convert string values to objects where necessary

    for (const key in filters) {
      try {
        filters[key] = JSON.parse(filters[key]);
      } catch (error) {
      }
    }

    //console.log(filters)

    // Finding posts based on filters
    const posts = await Post.find(filters);

    // Returning the result
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const updateFields = req.body;


    // Find the post by ID
    let post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the authenticated user is the owner of the post
    if (!post.owner.equals(req.id)) {
      return res.status(403).json({ message: 'You can update your own posts only' });
    }

    // Update the post with the new fields
    post = await Post.findByIdAndUpdate(postId, updateFields, { new: true });

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
