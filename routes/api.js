/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ObjectId    = require('mongodb').ObjectID;

module.exports = function (app, db) {
 
app.route('/api/issues/:project')

  .get(function (req, res){
    var project = req.params.project;

    var _id = req.query._id;
    var title = req.query.issue_title;
    var text = req.query.issue_text;
    var created = req.query.created_by; 
    var assigned = req.query.assigned_to
    var status = req.query.status_text
    var open = req.query.open;
    var jb = '{' +
        (_id !== '' && _id !== undefined ? '"_id": "' + ObjectId(_id) + '", ' : '' ) + 
        (title !== '' && title !== undefined? '"issue_title": "' + title + '", ' : '' ) + 
        (text !== '' && text !== undefined ? '"issue_text": "' + text + '", ' : '') +
        (created !== '' && created !== undefined? '"created_by": "' + created + '", ' : '') +
        (assigned !== '' && assigned !== undefined ? '"assigned_to": "' + assigned + '", ' : '') +
        (status !== '' && status !== undefined ? '"status_text": "' + status + '", ' :'') +
        (open !== '' && open !== undefined ? '"open": ' + open + ', ' : '') +
        '"projectname": "' + project + '"}';
    jb = JSON.parse(jb);

    db.collection('issues').find(jb).toArray((err, doc) => {
        if(err) {
          res.json('could not find ');
        } else {
          res.json(doc);
        }
    });
  
  })

  .post(function (req, res){

    var project = req.params.project;
    var title = req.body.issue_title;
    var text = req.body.issue_text;
    var created = req.body.created_by; 
    var assigned = req.body.assigned_to
    var status = req.body.status_text
    var date = new Date().toString();
    var j = {
        projectname: project,
        issue_title: title,
        issue_text: text,
        created_by: created,
        assigned_to: assigned,
        status_text: status,
        created_on: date,
        updated_on: date,
        open: true
      };

    db.collection('issues').insertOne(j, (err, doc) => {
          if(err) {
              res.json('could not add');
          } else {
              res.json(j);
          }
      }
    );

  })

  .put(function (req, res){

    var project = req.params.project;
    var _id = req.body._id;
    var title = req.body.issue_title;
    var text = req.body.issue_text;
    var created = req.body.created_by; 
    var assigned = req.body.assigned_to
    var status = req.body.status_text
    var open = new Boolean(req.body.open);
    var date = new Date().toString();
    var msg = '';
    if (title === '' && text === '' && created === '' && assigned === '' && status === '' && open == false) {
      msg = 'no updated field sent';
    } else {
      msg = 'successfully updated';
    }
    var jb = {
      _id: ObjectId(_id),
      projectname: project
    };
    var ju = '{' +
        (title !== '' ? '"issue_title": "' + title + '", ' : '' ) + 
        (text !== '' ? '"issue_text": "' + text + '", ' : '') +
        (created !== '' ? '"created_by": "' + created + '", ' : '') +
        (assigned !== '' ? '"assigned_to": "' + assigned + '", ' : '') +
        (status !== '' ? '"status_text": "' + status + '", ' :'') +
        (open == true ? '"open": false, ' : '') +
        '"updated_on": "' + date + '"}';
    ju = JSON.parse(ju);
    db.collection('issues').findOneAndReplace(jb, {$set: ju}, (err, doc) => {
        if(err || doc === null) {
            res.json('could not update ' + _id);
        } else {
            res.json(msg);
        }
      }
    );

  })

  .delete(function (req, res){
    var project = req.params.project;
    var _id = req.body._id;
    if (_id === '') {
      res.json('_id error');
    } else {
      var jb = {
          _id: ObjectId(_id),
          projectname: project
        };
      db.collection('issues').findOneAndDelete(jb, (err, doc) => {
            if(err || doc === null) {
                res.json('could not deleted ' + _id);
            } else {
                res.json('deleted ' + _id);
            }
          }
        );
    }
  });
    
};
