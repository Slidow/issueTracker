const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let issue1;
suite('Functional Tests', function() {
    const testId = '659c5b4a81c0e72da8237444';
    // POST REQUEST TEST
    test('POST Create an issue with every field', (done) => {
        chai.request(server)
            .post('/api/issues/chai_test')
            .send({
                issue_title: 'test1',
                issue_text: 'text1',
                created_by: 'chaitest',
                assigned_to: 'qwert',
                status_text: 'asdf'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'test1');
                assert.equal(res.body.issue_text, 'text1');
                assert.equal(res.body.created_by, 'chaitest');
                assert.equal(res.body.assigned_to, 'qwert');
                assert.equal(res.body.status_text, 'asdf');
                issue1 = res.body;
                done();
            })
    });

    test('POST Create an issue with only required fields', (done) => {
        chai.request(server)
            .post('/api/issues/chai_test')
            .send({
                issue_title: 'test2',
                issue_text: 'text2',
                created_by: 'chaitest'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'test2');
                assert.equal(res.body.issue_text, 'text2');
                assert.equal(res.body.created_by, 'chaitest');
                done();
            })
    });

    test('POST Create an issue with missing required fields', (done) => {
        chai.request(server)
            .post('/api/issues/chai_test')
            .send({
                issue_title: 'test3'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "required field(s) missing")
                done();
            })
    });

    // GET REQUEST TEST
    test('GET View issues on a project', (done) => {
        chai.request(server)
            .get('/api/issues/chai_test')
            .end((err, res) => {
                assert.equal(res.status, 200);
                done();
            })    
    });

    test('GET View issues on a project with one filter', (done) => {
        chai.request(server)
            .get('/api/issues/chai_test?issue_title=test1')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body[0].issue_title, "test1")
                done();
            })
    });

    test('GET View issues on a project with multiple filters', (done) => {
        chai.request(server)
            .get('/api/issues/chai_test?issue_title=test1&issue_text=text1')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body[0].issue_title, "test1")
                assert.equal(res.body[0].issue_text, "text1")
                done();
            })
    });

    // PUT REQUEST TEST
    test('PUT Update one field on an issue', (done) => {
        chai.request(server)
        .put('/api/issues/apitest')
        .send({
            _id: issue1._id,
            issue_title: "changed"
        })
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            done();
        })
    });

    test('PUT Update multiple fields on an issue', (done) => {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: issue1._id,
                issue_text: "changed text",
                created_by: "chaiTest" 
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully updated");
                done();
            })
    });

    test('PUT Update an issue with missing _id', (done) => {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                issue_text: "changed text2",
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            })
    });

    test('PUT Update an issue with no fields to update', (done) => {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: issue1._id
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                done();
            })
    });

    test('PUT Update an issue with an invalid _id', (done) => {
        chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: "659czb4a81z0e72da8175123",
                issue_text: "changed text"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update');
                done();
            })
    });

    // DELETE REQUEST TEST

    test('DELETE Delete an issue', (done) => {
        chai.request(server)
            .delete('/api/issues/apitest')
            .send({
                _id: issue1._id
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                done();
            })
    });

    test('DELETE Delete an issue with an invalid _id', (done) => {
        chai.request(server)
            .delete('/api/issues/chai_test')
            .send({
                _id: '659c5b4a81c0e72da8237123'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not delete');
                done();
            })
    });

    test('DELETE Delete an issue with missing _id', (done) => {
        chai.request(server)
            .delete('/api/issues/apitest')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            })
    });
});
