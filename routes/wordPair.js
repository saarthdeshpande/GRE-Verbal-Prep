const express = require('express');
const router = express.Router();
const Word = require('../models/wordPair')
const fs = require('fs')
const dict = require('../src/mw-dictionary')
const { isLoggedIn }  = require('../middleware/auth')

router.post('/deleteWord', isLoggedIn, async function (req, res, next) {
  try {
    await Word.deleteOne({ word: req.body.word }).then(() => console.log('Delete successful'))
  } catch(e) {
    console.log(e)
  }
})

router.post('/allWords', isLoggedIn, async function(req, res, next) {
  try {
    if (req.body.word) {  // if specific word (from learnt words) is requested, send that word-meaning pair
      const word = await Word.findOne({ word: req.body.word, user: req.session.user._id }).then((word) => this.word = word)
      if (!word) {
        return res.render('allWords', {words: [{word: req.body.word, meaning: "This word has not been added yet."}], image: req.session.user.picture});
      }
      res.render('allWords', {words: [this.word], image: req.session.user.picture})
    }
    // else {  // send all words
    //   const words = await Word.find({user: req.session.user._id}).then((words) => this.words = words)
    //   res.render('allWords', { words: this.words, image: req.session.user.picture })
    // }
  } catch(e) {
    console.log(e)
    res.render('error')
  }
})

router.get('/allWords', isLoggedIn, async function(req, res, next) {
  try {
    let words = await Word.find({user: req.session.user._id}).then((words) => this.words = words)
    res.render('allWords', {words, image: req.session.user.picture})
  } catch(e) {
    console.log(e)
    res.render('error')
  }
});

router.get('/dictionary', function (req, res, next) {
  try {
    res.render('dictionary', {image: req.session.user.picture})
  } catch (e) {
    console.log(e)
    res.redirect('/')
  }
})

router.post('/getDefinition', isLoggedIn, async function (req, res, next) {
  try {
    let definition = await dict.lookup(req.body.word).then(result => this.definition = result[0].definition)
    definition = Array.from(definition)
    definition = definition.filter(function(element, index, array) {
      return element.meanings !== undefined;
    })
    let meaning = definition[0].meanings.toString().replace(':','')
    while(meaning.includes(':')) {
      meaning = meaning.replace(':', '')
    }
    return res.send({word: JSON.stringify({word: req.body.word, meaning})})
  } catch(e) {
    console.log(e)
    res.render('dictionary', null)
  }
})

router.get('/newWord', isLoggedIn, async function(req, res, next) {
  try {
    res.render('addWord', { image: req.session.user.picture })
  } catch(e) {
    console.log(e)
    res.redirect('/')
  }
})

router.post('/newWord', isLoggedIn, async function(req, res, next) {
  try {
    let word;
    if(req.body.newWord && req.body.wordMeaning) {
      const user = req.session.user._id
      const wordCheck = await Word.findOne({word: req.body.newWord, user}).then((words) => this.words = words)
      print(wordCheck)
      if (wordCheck) {
        res.redirect('/allWords')
      }
      if (req.body.sentenceUse) {
        word = new Word({ word: req.body.newWord, meaning: req.body.wordMeaning, sentenceUse: req.body.sentenceUse, user })
      } else {
        word = new Word({ word: req.body.newWord, meaning: req.body.wordMeaning, sentenceUse: '-', user })
      }
      await word.save()
    }
    res.redirect('/allWords')
  } catch (e) {
    console.log(e)
    res.redirect('/')
  }
})


router.get('/getRandomWord', isLoggedIn, async function (req, res, next) {
  try {
    const count = await Word.countDocuments({user: req.session.user._id}).then((count) => this.count = count);
    if (count !== 0) {
      let {word, meaning, sentenceUse } = await Word.findOne({user: req.session.user._id}).skip(Math.random() * count)
      word = word.charAt(0).toUpperCase() + word.slice(1)
      return res.send(JSON.stringify({ word, meaning, sentenceUse }))
    } else {
      return null;
    }
  } catch(e) {
    console.log(e)
    res.redirect('/')
  }
})

router.get('/', isLoggedIn, async function(req, res, next) {
  try{
    const count = await Word.countDocuments({user: req.session.user._id}).then((count) => this.count = count);
    if (count !== 0) {
      let {word, meaning, sentenceUse } = await Word.findOne({user: req.session.user._id}).skip(Math.random() * count)
      word = word.charAt(0).toUpperCase() + word.slice(1)
      res.render('index', { word, meaning, sentenceUse, image: req.session.user.picture })
    } else {
      res.render('addWord', {image: req.session.user.picture})
    }
  } catch(e) {
    console.log(e)
    res.redirect('/')
  }
})

router.get('/getNewWord', isLoggedIn, function (req, res, next) {
  try {
    let rawData = fs.readFileSync('./wordMaster.json');
    rawData = JSON.parse(rawData)
    const singleEntry = rawData.words[Math.floor(Math.random() * rawData.words.length)]
    return res.send(JSON.stringify(singleEntry))
  } catch (e) {
    console.log(e)
    res.redirect('/')
  }
})


module.exports = router;
