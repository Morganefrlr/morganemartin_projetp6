const SauceModel = require('../models/sauce.model');
const UserModel = require('../models/user.model');
const fs = require('fs');




 
module.exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new SauceModel({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'sauce enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

module.exports.readSauce = (req, res, next) => {
  SauceModel.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

module.exports.sauceInfo = (req, res, next) => {
  SauceModel.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

module.exports.updateSauce = (req, res, next) => {
  SauceModel.findOne({_id: req.params.id})
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        }
        if (req.file) {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            const sauceObject =  {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            } 
            delete sauceObject._userId;
            SauceModel.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifié!'}))
              .catch(error => res.status(401).json({ error }));
          })
        }
        else {
          delete req.body.userId
          SauceModel.updateOne({ _id: req.params.id}, {...req.body, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifié!'}))
              .catch(error => res.status(401).json({ error }));
              
        }

      })
      .catch((error) => {
          res.status(400).json({ error });
      });
      
};

module.exports.likeSauce = (req, res, next) =>{
  SauceModel.findOne({_id : req.params.id}) 
    .then((sauce) => { 
    //like 1
      if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        console.log('condition reuni')
        SauceModel.findByIdAndUpdate({_id : req.params.id},{$addToSet: { usersLiked: req.body.userId}, $inc: { likes: 1}}, 
          { new: true} ) 
         .then(() => res.status(201).json({ message: 'Sauce liké !'}))
         .catch(error => { res.status(400).json( { error })}) 
      } 

    //like 0
      if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        console.log('condition reuni 2')
        SauceModel.findByIdAndUpdate({_id : req.params.id},{$pull: { usersLiked: req.body.userId}, $inc: { likes: -1}}, 
          { new: true} ) 
         .then(() => res.status(201).json({ message: 'Sauce liké à zero !'}))
         .catch(error => { res.status(400).json( { error })}) 
      } 
    //like -1
      if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
        console.log('condition reuni 3')
        SauceModel.findByIdAndUpdate({_id : req.params.id},{$addToSet: { usersDisliked: req.body.userId}, $inc: { dislikes: 1}}, 
          { new: true} ) 
         .then(() => res.status(201).json({ message: 'Sauce disliké !'}))
         .catch(error => { res.status(400).json( { error })}) 
      } 
    //like 0
      if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
        console.log('condition reuni 4')
        SauceModel.findByIdAndUpdate({_id : req.params.id},{$pull: { usersDisliked: req.body.userId}, $inc: { dislikes: -1}}, 
          { new: true} ) 
         .then(() => res.status(201).json({ message: 'Sauce disliké à zero !'}))
         .catch(error => { res.status(400).json( { error })}) 
      } 
    }) 


}

module.exports.deleteSauce = (req, res, next) => {
  SauceModel.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  SauceModel.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};







