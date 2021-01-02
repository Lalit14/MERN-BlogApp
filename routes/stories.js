const express=require('express')
const Story=require('../models/Story')
const { route } = require('./auth')
const {ensureAuth ,ensureGuest}=require('../middleware/auth')


const router =express.Router()

// router.get('/',ensureAuth,(req,res)=>{
//     res.render('stories')
//     })
    
// add page
//route -- GET/stories/add
router.get('/add',ensureAuth,(req,res)=>{
res.render('stories/add')
})

// post request to /stories add form 
router.post('/',ensureAuth,async(req,res)=>{
    try {
        req.body.user=req.user.id    //hence our form does not includes user we add it to body form req.user or req.user.id 
            await Story.create(req.body)
            res.redirect('/dashboard')

    } catch (error) {
        console.error(error)
        res.render('error/500')
    }

})
    
// to show stories page
//route -- GET/stories/
router.get('/',ensureAuth,async(req,res)=>{
    try {
    const stories=await Story.find({status:'public'})
    .populate('user')
    .sort({createAt:'desc'})
    .lean()
    
    res.render('stories/index',{
        stories,
    })    
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
    
    
    })
    

// edit route
router.get('/edit/:id',ensureAuth,async(req,res)=>{
        const story= await Story.findOne({
            _id:req.params.id     
        }).lean()
        console.log(story)
        if(!story){
            return res.render('error/404')

        }
        else{
            res.render('stories/edit',{
               
                story,

            })


        }


})

  
// update page
//route -- GET/stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })

//delete route
router.delete('/:id',ensureAuth,async(req,res)=>{
try {
  await Story.remove({_id:req.params.id})
res.redirect('/dashboard')

} catch (error) {    
  console.log
  return res.render('error/500')
  
}

})

// show full story 
router.get('/:id',ensureAuth,async(req,res)=>{
let story=await Story.findById(req.params.id)
.populate('user')
.lean()
res.render('stories/show',{
story
})
  })
  
//  
router.get('/user/:userId',ensureAuth,async(req,res)=>{
  const stories=await  Story.find({
    user:req.params.userId,
    status:'public'

  })
.populate('user')
.lean()
res.render('stories/index',{
stories,

})

  })
  
module.exports=router
