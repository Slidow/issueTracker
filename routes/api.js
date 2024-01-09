'use strict';

const IssueModel = require("../database").Issue;
const ProjectModel = require("../database").Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let project = req.params.project;
      let findProject = await ProjectModel.findOne({ projectname: project });

      let issues =  await IssueModel.find({
        project_id: findProject._id,
        ...req.query,
      });

      res.json(issues);
      return;    
    })

    
    .post(async (req, res) => {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if ( !project || !issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      }

      try{
        //check if project exist
        let findProject = await ProjectModel.findOne({projectname: project});
        if (!findProject) {
          findProject = new ProjectModel({projectname: project});
          findProject = await findProject.save();
        }
        //save the issue
        let newIssue = new IssueModel({
          project_id: findProject._id,
          issue_title,
          issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by,
          assigned_to: assigned_to || '',
          open: true,
          status_text: status_text || '',
        });

        newIssue = await newIssue.save();
        res.json(newIssue);

      }catch(err) {
        console.log(err);
      }
    })
    
    .put(async (req, res) => {
      let project = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if(!_id) {
        res.json({ error: 'missing _id' });
        return;
      }
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        res.json({ error: 'no update field(s) sent', _id: _id });
        return;
      }
      try {
        let findIssue = await IssueModel.findByIdAndUpdate(_id, {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
          updated_on: new Date()
        })
        findIssue = await findIssue.save();
        res.json({ result: 'successfully updated', _id: _id });
      }catch(err) {
        res.json({ error: 'could not update', _id: _id })
      }
    })
    
    .delete(async (req, res) => {
      let project = req.params.project;
      let  { _id } = req.body;

      if (!_id) {
        res.json({ error: 'missing _id' });
        return; 
      }
     
        let deleteIssue = await IssueModel.deleteOne({_id})
        if (deleteIssue.deletedCount > 0) {
          res.json({ result: 'successfully deleted', _id: _id })
        }else {
          res.json({ error: 'could not delete', _id: _id });
        }
    });
    
};
