import express from 'express';
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    middl_post,
    check_empty,
} from '../controllers/posts.js';

const router = express.Router();

// Middleware to handle OPTIONS requests
router.options("/:id", (req, res) => {
    console.log("OPTIONS");
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.send();
});

router.options("/", (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
    res.setHeader('Allow', 'GET, POST, OPTIONS, DELETE');
    res.send();
});

// Middleware to check for empty values in the POST request
router.post("/", (req, res, next) => {
    console.log("POST middleware to check for empty values");
    if (req.body.title && req.body.subtitle && req.body.author && req.body.category && req.body.body) {
        next();
    } else {
        res.status(400).json({ message: "There are empty values in your POST" });
    }
});

// Routes
router.get("/", middl_post, getPosts);
router.post('/', middl_post, createPost);
router.put('/:id', check_empty, updatePost);
router.delete('/:id', deletePost);
router.get('/:id', getPost);

export default router;
