const express = require('express');

const Posts = require('../data/db');

const router = express.Router();

router.use(express.json());


// GET posts
router.get('/', (req, res) => {
  Posts.find(req.query)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "The posts information could not be retrieved." });
  });
});

// GET posts/:id
router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found' });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: "The post information could not be retrieved." });
  });
});

// POST posts
router.post('/', (req, res) => {
  const {title, contents} = req.body;

  if (!title || !contents) {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
  } else {
    Posts.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "There was an error while saving the post to the database" });
    });    
  }
});

// DELETE posts
router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: 'The post has been nuked' });
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error removing the post',
    });
  });
});

// UPDATE posts
router.put('/:id', (req, res) => {
  const changes = req.body;
  Posts.update(req.params.id, changes)
  .then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'The post could not be found' });
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error updating the post',
    });
  });
});

// GET posts/:id/comments
router.get('/:id/comments', (req, res) => {
  Posts.findCommentById(req.params.id)
  .then(comments => {
    if (comments) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
  }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Error retrieving the comments'});
  });
});

// POST posts/:id/comments
router.post('/:id/comments', (req, res) => {
  const id = req.params.id;
  const commentData = req.body;

  Posts.findById(id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })

  if (!commentData.text) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.insertComment(commentData)
      .then(comment => {
        Posts.findCommentById(comment.id)
              .then(newComment => {
                  res.status(201).json(newComment);
              })
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({ error: "There was an error while saving the comment to the database." });
      });
  }
});

module.exports = router;