const mongoose = require('mongoose')
const blogSchema = mongoose.Schema({

 title: {type: String},
 content: {type: String},
 author: {first: String, last: String},
 created: {type: Date, default: Date.now}

})

blogSchema.methods.apiRepr  =  function(){
return {
	title: this.title,
	content: this.content,
	author: {
		firstName: this.firstName,
		lastName: this.lastName
	},
    created: this.created
    };
}


const Blog = mongoose.model('blogPost', blogSchema)

module.exports = {Blog}