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
    res.status(500).json({
      message: 'Error retrieving the posts',
    });
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
    res.status(500).json({
      message: 'Error retrieving the post',
    });
  });
});

// POST posts
router.post('/', (req, res) => {
  Posts.insert(req.body)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error adding the post',
    });
  });
});

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

// router.get('/:id/messages', (req, res) => {
//   posts.findpostMessages(req.params.id)
//   .then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({ message: 'post not found' });
//     }
//   })
//   .catch(error => {
//     // log error to database
//     console.log(error);
//     res.status(500).json({
//       message: 'Error retrieving the post',
//     });
//   });
// });

// router.post('/:id/messages/', (req, res) => {

//   posts.addMessage(req.body)
//   .then(message => {
//     res.status(201).json(message);
//   })
//   .catch(error => {
//     // log error to database
//     console.log(error);
//     res.status(500).json({
//       message: 'Error adding the post',
//     });
//   });
// });

module.exports = router;