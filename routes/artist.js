'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var md_auth = require('../middelwares/authenticated')
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artist'});

api.get('/get-artist/:id',md_auth.ensureAuth,ArtistController.getArtist);
api.post('/save-artist',md_auth.ensureAuth,ArtistController.saveArtist);
api.get('/find-artist/:page?',md_auth.ensureAuth,ArtistController.getArtistsFind);
api.put('/update-artist/:id',md_auth.ensureAuth,ArtistController.updateArtist);
api.delete('/remove-artist/:id',md_auth.ensureAuth,ArtistController.deleteArtist);

api.post('/upload-image-artist/:id',[md_auth.ensureAuth,md_upload],ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile',ArtistController.getImageFile);





module.exports = api;