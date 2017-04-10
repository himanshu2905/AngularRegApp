'use strict';

const Joi = require('joi');
const Boom = require('boom');

exports.register = function(server, options, next){
  const db = server.app.db;

  server.route({
    method:'GET',
    path:'/courses',
    handler: function(request, reply){
      db.courses.find((err,docs) => {
        if(err){
          return reply(Boom.wrap(err,'Internal Server Error'));
        }
        reply(docs);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/courses/{courseId}',
    handler: function (request, reply) {
      db.courses.findOne({_id: request.params.courseId}, (err, doc) => {
          if (err) {
              return reply(Boom.wrap(err, 'Internal MongoDB error'));
          }
          if (!doc) {
              return reply(Boom.notFound());
          }
          reply(doc);
      });

    }
  });

  server.route({
    method: 'POST',
    path: '/courses',
    handler: function (request, reply) {
      const course = request.payload;
      db.courses.save(course, (err, result) => {
          if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
          }
          reply(course);
      });
    },
    config: {
        validate: {
            payload: {
              _id: Joi.string().min(5).max(5).required(),
              name: Joi.string().min(10).max(50).required()
            }
        }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/courses/{courseId}',
    handler: function (request, reply) {
        db.courses.remove({
            _id: request.params.courseId
        }, function (err, result) {
            if (err) {
               return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }
            if (result.n === 0) {
                return reply(Boom.notFound());
            }
            reply().code(204);
        });
      }
    });

  server.route({
    method: 'PATCH',
    path: '/courses/{courseId}',
    handler: function (request, reply) {
        db.courses.update({_id: request.params.courseId},
          {
            $set: request.payload
          }, function (err, result) {
                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }
                if (result.n === 0) {
                    return reply(Boom.notFound());
                }
                reply().code(204);
          });
    },
    config: {
        validate: {
            payload: Joi.object({
              name: Joi.string().min(10).max(50).required()
            }).required().min(1)
        }
    }
  });

  return next();
}
//This defines a new hapi plugin called routes-courses which encapsulates our routes definitions and handlers.
//Plugins are a central concept of hapi and allow to build modular applications.
exports.register.attributes = {
  name:'routes-courses'
}
