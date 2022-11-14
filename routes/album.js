'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middelwares/authenticated')
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/album'});

api.get('/get-album/:id',md_auth.ensureAuth,AlbumController.getAlbum);
api.post('/save-album',md_auth.ensureAuth,AlbumController.saveAlbum);
api.get('/find-album/:artist?',md_auth.ensureAuth,AlbumController.getAlbumFind);
api.put('/update-album/:id',md_auth.ensureAuth,AlbumController.updateAlbum);
api.delete('/remove-album/:id',md_auth.ensureAuth,AlbumController.deleteAlbum);

api.post('/upload-image-album/:id',[md_auth.ensureAuth,md_upload],AlbumController.uploadImage);
api.get('/get-image-album/:imageFile',AlbumController.getImageFile);

module.exports = api;