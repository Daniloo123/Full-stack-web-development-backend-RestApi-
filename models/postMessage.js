import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const options = { toJSON: { virtuals: true } };
const postSchema = mongoose.Schema({
    title: String,
    subtitle:String,
    body: String,
    author:String,
    category:String,
    created_at: String
    
}, options)


postSchema.plugin(paginate)

postSchema.virtual('_links').get(function () {
    return {
      self: { 
          href: 'http://145.24.222.54:9000/posts/' + this.id
      },
      collection: { 
          href: 'http://145.24.222.54:9000/posts'
      }
    }
});

var PostMessage = mongoose.model('test.PostMessage', postSchema, "PostMessage" );

//module.exports = mongoose.model('PostMessage', postSchema);
export default PostMessage;