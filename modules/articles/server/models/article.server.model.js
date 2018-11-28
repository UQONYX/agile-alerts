'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill job posting title',
    trim: true
  },
  schedule: {
    type: String,
    default: '',
    required: 'Please specify which days and times the job is.',
    trim: true
  },
  city: {
    type: String,
    default: '',
    required: 'Please specify the location of the position.',
    trim: true
  },
  pay: {
    type: Number,
    default: '',
    required: 'Please specify the rate of the job.',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  applicants: [{ "applicantID": String }]
},
  {
    usePushEach: true
  });

ArticleSchema.statics.seed = seed;

mongoose.model('Article', ArticleSchema);

/**
* Seeds the User collection with document (Article)
* and provided options.
*/
function seed(doc, options) {
  var Article = mongoose.model('Article');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Article
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Article (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Article\t' + doc.title + ' skipped')
          });
        }

        var article = new Article(doc);

        article.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Article\t' + article.title + ' added'
          });
        });
      });
    }
  });
}
