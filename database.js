let mongoose = require('mongoose');

//connecting to my mongoDB database
const db = mongoose.connect(process.env.MONGO_URI);

//creating the issue schema
const issueSchema = new mongoose.Schema({
    project_id: {type: String, required: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date, required: true},
    created_by: {type: String, required: true},
    assigned_to: {type: String},
    open: {type: Boolean, required: true},
    status_text: {type: String},
});

//creating the project schema
const projectSchema = new mongoose.Schema({
    projectname: {type: String}
});

//creating the issue model
const Issue = mongoose.model('Issue', issueSchema);

//creating the project model
const Project = mongoose.model('Project', projectSchema);

exports.Issue = Issue;
exports.Project = Project;

