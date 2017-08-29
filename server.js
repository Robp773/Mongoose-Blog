const express =  require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-Parser')
const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./models')
const app =  express();
mongoose.connect(DATABASE_URL);
mongoose.Promise = global.Promise;
app.use(bodyParser.json());

app.get('/posts', function(req, res){
	Blog
	.find()
	.then(function(posts){
	// const result = posts.map(function(post){
	// 	post.apiRepr()})
res.json(posts.map(function(post) {
	post.apiRepr()
}));
	})
});

app.get('/posts/:id', function(req, res){
	Blog
	.findById(req.params.id)
	.then(function(post) {
		res.json(post.apiRepr())
	})
 .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });

})

app.post('/posts', function(req, res){
	const requiredFields = ['title', 'content', 'author']
	for(i=0; i<requiredFields.length(); i++){
	if (!(requiredFields[i] in req.body)){
		res.status(400).send('missing fields')
	}}
     Blog.create({
     	title: req.body.title,
     	content: req.body.content,
     	author: {
     		firstName: req.author.firstName,
     		lastName: req.author.lastName
     	}

     	})
     .then(function(createdBlog){
     	res.json(createdBlog.apiRepr())
     })
     
})

app.put('/posts/:id', function (req, res) {

	if(req.params.id !== req.body.id){
		res.send("Param and body ids do not match")
	}
	const updateList = {}
	const updateAble = ['title', 'content', 'author']
	updateAble.forEach(function(item){
		if (item in req.body){
			updateList[item] =  req.body[item]
		}
	})
	Blog
	.findByIdAndUpdate(req.params.id, {$set: updateList}, {new: true})
	
})
app.delete('/posts/:id', function(req, res){
Blog
.findByIdAndRemove(req.params.id)
.then(function(){
	res.status(204)
})
})

let server; 

function runServer() { 
  const port = process.env.PORT || 8080;   
return new Promise((resolve, reject) => { 
server = app.listen(port, () => { 
console.log(`Your app is listening on port ${port}`);      
resolve(server);     
})     
.on('error', err => {       
reject(err);     
}); 
  }); 
}

function closeServer() { 
  return new Promise((resolve, reject) => { 
    console.log('Closing server'); 
    server.close(err => { 
      if (err) { 
        reject(err); 
        return; 
      } 
      resolve(); 
    }); 
  }); 
} 


if (require.main === module) {
  runServer().catch(err => console.error(err));
};
module.exports = {app, closeServer, runServer}