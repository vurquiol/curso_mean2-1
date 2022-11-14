'use strict'

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongosePaginate = require('mongoose-pagination');

var fs = require('fs');
var path = require('path');

function getArtist(req,res) {
    var artistId =req.params.id;

    Artist.findById(artistId,(err,artist)=>{
        if (err) {
	        res.status(500).send({message:'Error en la peticion'});           
        } else {
            if (!artist) {
	            res.status(404).send({message:'El artista no existe'});               
            } else {
	            res.status(200).send({artist});                
            }
        }
    });    
}

function saveArtist(req,res) {
    var artist = new Artist();
    var params = req.body;
    artist.name=params.name;
	artist.description=params.description;
	artist.image=null;

    artist.save((err,artistStored)=>{
        if (err) {
	        res.status(500).send({message:'Error al guardar artista'});	            
        } else {
            if (!artistStored) {
	        res.status(404).send({message:'El artista no ha sido guardado'});	            
                
            } else {
                res.status(200).send({artist:artistStored});                
            }
        }
    });
}

function getArtistsFind(req,res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
   
    var itemsPerPage =2;

    Artist.find().sort('name').paginate(page,itemsPerPage, function (err,artists,total) {
        if (err) {
	        res.status(500).send({message:'Error en la peticion'});
        } else {
            if (!artists) {
	            res.status(404).send({message:'No hay artistas'});              
            } else {
                return res.status(200).send({
                    total_items: total,
                    artists:artists
                });       
            }
        }
    });
    
}

function updateArtist(req,res) {
    var artistId= req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId,update,(err,artistUpdate)=>{
        if (err) {
	        res.status(500).send({message:'Error en actualizar Artista'});
            
        } else {
            if (!artistUpdate) {
	            res.status(404).send({message:'El artista no ha sido actualizado'});
                
            } else {
                return res.status(200).send({artists:artistUpdate}); 
            }
        }
    });

}

function deleteArtist(req,res) {
    var artistId= req.params.id;

    Artist.findByIdAndRemove(artistId,(err,artistRemoved)=>{
        if (err) {
	        res.status(500).send({message:'Error en eliminar Artista'});
            
        } else {
            if (!artistRemoved) {
	            res.status(404).send({message:'El artista no ha sido eliminado'});
                
            } else {
              
                Album.find({artist:artistRemoved._id}).remove((err,albumremoved)=>{
                    if (err) {
                        res.status(500).send({message:'Error en eliminar Album'});
                        
                    } else {
                        if (!albumremoved) {
                            res.status(404).send({message:'El album no ha sido eliminado'});
                            
                        } else {
                            Song.find({album:albumremoved._id}).remove((err,songRemoved)=>{
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
        }
    });
}

function uploadImage(req,res) {
    var artistId = req.params.id;
    var file_name ='No Subido';

    if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ex_split = file_name.split('\.');
		var file_ext = ex_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' ||file_ext == 'gif') {
			Artist.findByIdAndUpdate(artistId,{image:file_name},(err,artistUpdate)=>{
				if (!artistUpdate) {
					res.status(404).send({message:'No se ha podido actualizar la imagen del Artista'});			
				} else {
					res.status(200).send({artist:artistUpdate});
					
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
	var path_file ='./uploads/artist/'+imageFile;

	fs.exists(path_file,function (exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(200).send({message:'No existe la imagen...'});	
		}
	})
}


module.exports = {
	getArtist,
    saveArtist,
    getArtistsFind,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
	
};