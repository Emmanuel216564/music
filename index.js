var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mediaserver = require('mediaserver');
var multer = require('multer');

/* se implementa multer que es un middlewere 
pasandole un aobjeto y utilizando la libreria path
que es la libreria que nos ayuda a apuntar una direccion
en nuestro sistema operativo*/
var optionMulter = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, 'songs'));
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});

var upload = multer({storage: optionMulter});

app.use(express.static('public'));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});


/*funcion para enviar la lista de canciones (api) con moculo fs File sistem
que nos permite acceder a archivos de la computadora*/
app.get('/songs', function(req, res){
    fs.readFile(path.join(__dirname,'songs.json'), 'utf-8', function(err, songs){
        if (err) throw err;
        res.json(JSON.parse(songs));
    })
});

/*funcion media server para que el navegador pueda reproducir audio
mediante un pipe*/ 
app.get('/songs/:name', function(req, res){
    var song = path.join(__dirname,'songs', req.params.name);
    mediaserver.pipe(req, res, song);
});

/* se crea el metodo post para que el administrador o usuario
pueda subir las canciones que requeira */
app.post('/songs', upload.single('song'), function(req, res){
    var fileSongs = path.join(__dirname, 'songs.json');
    var name = req.file.originalname;
    fs.readFile(fileSongs, 'utf-8', function(err, file){
        if (err) throw err;
        var songs = JSON.parse(file);
        songs.push({name: name});
        fs.writeFile(fileSongs, JSON.stringify(songs), function(err){
            if (err) throw err;
            res.sendFile(path.join(__dirname, 'index.html'));
        })
    });
    
});


app.listen(3000, function(){
    console.log('Run aplication');
});
