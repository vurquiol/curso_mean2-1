'use strict'

var Album = require('../models/album');
var Song = require('../models/song');
var mongosePaginate = require('mongoose-pagination');

var fs = require('fs');
var path = require('path');

function getAlbum(req,res) {
    var albumId =req.params.id;

    Album.findById(albumId).populate({path:'artist'}).exec((err,album)=>{
        if (err) {
	        res.status(500).send({message:'Error en la peticion'});           
        } else {
            if (!album) {
	            res.status(404).send({message:'El Album no existe'});               
            } else {
	            res.status(200).send({album});                
            }
        }
    });    
}

function saveAlbum(req,res) {
    var album = new Album();
    var params = req.body;

    album.title=params.title;
	album.description=params.description;
	album.year=params.year;
	album.image=null;
    album.artist=params.artist;


    album.save((err,albumStored)=>{
        if (err) {
	        res.status(500).send({message:'Error al guardar artista'});	            
        } else {
            if (!albumStored) {
	        res.status(404).send({message:'El artista no ha sido guardado'});	            
                
            } else {
                res.status(200).send({album:albumStored});                
            }
        }
    });
}

function getAlbumFind(req,res) {
    var artistId = req.params.artist;
    
    if (!artistId) {
        var find = Album.find({}).sort('title');
    } else {
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path:'artist'}).exec((err,album)=>{
        if (err) {
	        res.status(500).send({message:'Error en la peticion'});           
        } else {
            if (!album) {
	            res.status(404).send({message:'El Album no existe'});               
            } else {
	            res.status(200).send({album});                
            }
        }
    });   
}

function updateAlbum(req,res) {
    var albumId= req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId,update,(err,albumUpdate)=>{
        if (err) {
	        res.status(500).send({message:'Error en actualizar Artista'});
            
        } else {
            if (!albumUpdate) {
	            res.status(404).send({message:'El artista no ha sido actualizado'});
                
            } else {
                return res.status(200).send({album:albumUpdate}); 
            }
        }
    });

}

function deleteAlbum(req,res) {
    var AlbumId= req.params.id;

    Album.findByIdAndRemove(AlbumId,(err,artistRemoved)=>{
        if (err) {
            res.status(500).send({message:'Error en eliminar Album'});
            
        } else {
            if (!artistRemoved) {
                res.status(404).send({message:'El album no ha sido eliminado'});
                
            } else {
                Song.find({album:artistRemoved._id}).remove((err,songRemoved)=>{
                    if (err) {
                        res.status(500).send({message:'Error en eliminar la cancion'});
                        
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message:'Las Canciones no han sido eliminado'});
                            
                        } else {
                            return res.status(200).send({artist:artistRemoved}); 
                           
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req,res) {
    var albumId = req.params.id;
    var file_name ='No Subido';

    if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ex_split = file_name.split('\.');
		var file_ext = ex_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' ||file_ext == 'gif') {
			Album.findByIdAndUpdate(albumId,{image:file_name},(err,albumUpdate)=>{
				if (!albumUpdate) {
					res.status(404).send({message:'No se ha podido actualizar la imagen del Album'});			
				} else {
					res.status(200).send({album:albumUpdate});
					
				}
			});
		} else {
			res.status(200).send({message:'extencion archivo no valida'})				
			
		}
		//console.log(ex_split);
	} else {
		res.status(404).send({message:'La Imagen no se ha subido'})				
		
	}
}

function getImageFile(req,res) {
	var imageFile = req.params.imageFile;
	var path_file ='./uploads/album/'+imageFile;

	fs.exists(path_file,function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({message:'No existe la imagen...'});	
		}
	})
}



module.exports = {
	saveAlbum,
	getAlbum,
    getAlbumFind,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};