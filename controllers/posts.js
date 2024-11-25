import express, { query } from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';
import url from 'node:url';

const router = express.Router();



export const getPosts = async (req, res) => {
    //const { limit, start} = req.params;
    const queryObject = url.parse(req.url, true).query;
    var total_count = 0

    //console.log("limit: "+limit_query)
    function count_pages(size, limit) {
        var count_page = size * limit
        return count_page - (limit - 1)
    }
    await PostMessage.countDocuments({}, function (err, result) {
        total_count = result
    })
    //const limit_query= parseInt(queryObject.limit)
    console.log(req.query);

    console.log(queryObject.limit)

    if (req.query.start) {
        const limit = req.query.limit
        const start = req.query.start
        //let postMessages= await PostMessage.find().skip(start).limit(limit)
        var pages_options = {}


        PostMessage.paginate({}, { offset: start, limit: limit })
            .then(result => {
                //console.log(result);
                let post_collection = {
                    items: result.docs,
                    _links: {
                        self: {
                            href: "http://localhost:8000/posts"
                        },
                        collection: {
                            href: "http://localhost:8000/posts"
                        }
                    },
                    pagination: {
                        currentPage: result.page,
                        currentItems: limit,
                        totalPages: result.totalPages,
                        totalItems: result.totalDocs,
                        _links: {
                            first: {
                                page: 1,
                                href: "http://localhost:8000/posts/?start=1&limit=" + result.limit
                            },
                            last: {
                                page: result.totalPages,
                                href: "http://localhost:8000/posts/?start=" + count_pages(result.totalPages, result.limit) + "&limit=" + result.limit

                            },
                            previous: {
                                page: result.prevPage,
                                href: "http://localhost:8000/posts/?start=" + count_pages(result.prevPage - 1, result.limit) + "&limit=" + result.limit

                            },
                            next: {
                                page: result.nextPage,
                                href: "http://localhost:8000/posts/?start=" + count_pages(result.nextPage - 1, result.limit) + "&limit=" + result.limit

                            },

                        }
                    }
                }

                console.log(post_collection)
                res.status(200).json(post_collection);

            });

    }
    else {
        try {

            let postMessages = await PostMessage.find()

            let post_collection = {
                items: postMessages,
                _links: {
                    self: {
                        href: "http://localhost:8000/posts"
                    },
                    collection: {
                        href: "http://localhost:8000/posts"
                    }
                },
                pagination: {
                    currentPage: 1,
                    currentItems: total_count,
                    totalPages: 1,
                    totalItems: total_count,
                    _links: {
                        first: {
                            page: 1,
                            href: "http://localhost:8000/posts"
                        },
                        last: {
                            page: 1,
                            href: "http://localhost:8000/posts"
                        },
                        previous: {
                            page: 1,
                            href: "http://localhost:8000/posts"
                        },
                        next: {
                            page: 1,
                            href: "http://localhost:8000/posts"
                        },

                    }
                }
            }

            res.status(200).json(post_collection);




        } catch (error) {
            res.status(404).json({ message: error.message });
        }

    }

}

export const getPost = async (req, res) => {

    const { id } = req.params;

    const isExists = await PostMessage.exists({ _id: id });
    console.log(isExists);

    if (isExists) {
        try {
            const post = await PostMessage.findById(id);

            res.status(200).json(post);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }

    }

    else {
        res.status(404).json({ "error": "ID is not exists" })
    }
}



export const middl_post = async (req, res, next) => {
    console.log(req.header("Accept"));
    if (req.header("Accept") === "application/json") {
        console.log("Completed ")
        next();
    }
    else {
        res.status(415).send({ message: "unsupported media type" });
    }
}

export const createPost = async (req, res) => {
    console.log("test")
    const { title, subtitle, author, category, body } = req.body;
    const created_at = new Date().toLocaleDateString("nl-NL", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute: '2-digit' })
    //console.log(req.body);

    console.log("BODY: " + req.body.title)

    const newPostMessage = new PostMessage({ title, subtitle, body, author, category, created_at })

    try {

        await newPostMessage.save();


        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const check_empty = async (req, res, next) => {
    if (req.body.title && req.body.subtitle && req.body.author && req.body.body && req.body.category) {
        next()
    }
    else {
        res.status(400).send();
    }
}


export const updatePost = async (req, res) => {
    const { id } = req.params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`Invalid ID: ${id}`);
    }

    try {
        // Log relevant information
        console.log('Updating post. ID:', id);
        console.log('Request body:', req.body);

        // Use findByIdAndUpdate to update the post
        const updatedPost = await PostMessage.findByIdAndUpdate(id, req.body, { new: true });

        // Log the updated post
        console.log('Updated post:', updatedPost);

        // Check if the post was found and updated
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Respond with the updated post
        res.json(updatedPost);
    } catch (error) {
        // Log any errors
        console.error('Update error:', error);

        // Handle errors and respond with an error message
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};




export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid ID' });
    }

    try {
        const deletedPost = await PostMessage.findByIdAndRemove(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(204).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export default router;