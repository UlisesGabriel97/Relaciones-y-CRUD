const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
        .then(genres => {
            res.render('moviesAdd',{allGenres:genres})
        })
        .catch(errors => res.send(errors))
    },

    create: function (req,res) {
        let {title, rating, awards, release_date, length, genre_id} = req.body

        db.Movie.create({
            title,
            rating: +rating,
            awards: +awards,
            release_date,
            length: +length,
            genre_id: +genre_id,
            created_at: new Date,
            updated_at: new Date
        })
        .then(() => {
            res.redirect('/movies')
        })
        .catch(errors => res.send(errors))
    },

    edit: function(req,res) {
        let idParams = +req.params.id

        let pelicula = db.Movie.findByPk(idParams)
        let generos = db.Genre.findAll()
        Promise.all([pelicula,generos])
        .then(([pelicula,generos]) => {
            res.render('moviesEdit',{
                Movie: pelicula,
                allGenres: generos
            })
        })
        .catch(errors => res.send(errors))
    },

    update: function (req,res) {
        let idParams = +req.params.id
        let {title, rating, awards, release_date, length, genre_id} = req.body
        db.Movie.update({
            title,
            rating: +rating,
            awards: +awards,
            release_date,
            length: +length,
            genre_id: +genre_id,
            updated_at: new Date
        },{
            where: {id: idParams}
        })
        .then(() => {
            res.redirect('/movies')
        })
        .catch(errors => res.send(errors))
    },

    delete: function (req,res) {
        const idParams = +req.params.id

        db.Movie.findByPk(idParams)
        .then(Movie => {
            res.render('moviesDelete',{Movie})
        })
        .catch(errors => res.send(errors))
    },

    destroy: function (req,res) {
        const idParams = +req.params.id

        db.Movie.destroy({
            where: {id: idParams}
        })
        .then(() => {
            res.redirect('/movies')
        })
        .catch(errors => res.send(errors))
    }
}

module.exports = moviesController;
