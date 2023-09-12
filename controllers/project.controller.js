const router = require('express').Router();
const { validateSession } = require('../middleware');
const { success, error, incomplete } = require('../utils');
const { Project } = require('../models');

//! Create Project
router.post('/create', validateSession, async (req,res) => {
    try {
        
        const { 
            title, repoFrontEnd, repoBackEnd, 
            url, details, logo, 
            display, forCompany, type 
        } = req.body;
        const { id } = req.user;

        const info = {
            title, repoFrontEnd, repoBackEnd, 
            url, details, logo, display, forCompany, type,
            owner: id
        }

        const project = await new Project(info).save();

        project ? success(res, project) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Get One
router.get('/one/:id', validateSession, async (req,res) => {
    try {
        const { id } = req.params;
        const owner = req.user.id;

        const project = await Project.findOne({_id: id, owner: owner});

        project ? success(res, project) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Get All (admin)
router.get('/all', validateSession, async (req,res) => {
    try {
        
        const { id } = req.user
        const allProjects = await Project.find({owner: id});

        allProjects ? success(res,allProjects) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Get All (for display)
router.get('/display', async (req,res) => {
    try {
        
        const projectsToDisplay = await Project.find({display: true});
        projectsToDisplay ? success(res,projectsToDisplay) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Get One (for display)
router.get('/view/:id', async (req,res) => {
    try {
        const { id } = req.params;
        
        const viewSingleProject = await Project.findOne({_id: id, display: true});
        viewSingleProject ?
            success(res, viewSingleProject) :
            incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Update
router.put('/update/:id', validateSession, async (req,res) => {
    try {

        const { id } = req.params;
        const { id: owner } = req.user;
        const options = {new:true};

        const { 
            title, repoFrontEnd, repoBackEnd, 
            url, details, logo, 
            display, forCompany, type 
        } = req.body;

        const info = {
            title, repoFrontEnd, repoBackEnd, 
            url, details, logo, display, forCompany, type
        }      

        const update = await Project.findOneAndUpdate({_id: id, owner: owner}, info, options);

        update ? success(res, update) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

//! Delete
router.delete('/remove/:id', validateSession, async (req,res) => {
    try {
        
        const { id } = req.params;
        const { id: ownerId } = req.user;
        const filter = {
            _id: id,
            owner: ownerId
        }

        const removeProject = await Project.findOneAndDelete(filter);
        const msg = removeProject ? `Project Removed` : null;

        msg ? success(res,msg) : incomplete(res);

    } catch (err) {
        error(res,err);
    }
});

module.exports = router;