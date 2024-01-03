import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost, middl_post, check_empty,  } from '../controllers/posts.js';

const router = express.Router();


router.options("/:id", (req , res) => {
    console.log("OPTIONS");
    res.setHeader('Access-Control-Allow-Methods','GET, PUT, DELETE, OPTIONS' );
    res.setHeader("Allow", 'GET, PUT, DELETE, OPTIONS');
    res.send();

})

router.options("/", (req , res) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.send();

})

router.options("/:id", (req , res) => {
  
    res.setHeader('Access-Control-Allow-Methods','GET, PUT, DELETE, OPTIONS' );
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.send();

})

router.post("/", (req, res, next) => {
    console.log("POST middleware to check for empty values")
    if (req.body.title && req.body.subtitle && req.body.body && req.body.author && req.body.category ){
        next();
    } else {
        res.status(400).json({message: "There are empty values in your POST"});
    }
});

router.get("/", middl_post,  getPosts);
router.post('/', middl_post, createPost);
router.put('/:id', check_empty, updatePost);
router.put('/', createPost);  
router.get('/:id', getPost);
router.delete('/:id', deletePost);

export default router;