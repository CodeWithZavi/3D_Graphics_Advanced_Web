const express = require('express');
const router = express.Router();
const Scene = require('../models/Scene');
const authenticateToken = require('../middleware/auth');

// Save or update scene
router.post('/save', authenticateToken, async (req, res) => {
    try {
        const { sceneId, sceneObjects, cameraPosition, viewMode } = req.body;

        let scene;
        if (sceneId) {
            // Update existing scene
            scene = await Scene.findOneAndUpdate(
                { _id: sceneId, userId: req.user.id },
                {
                    sceneObjects,
                    cameraPosition,
                    viewMode,
                    lastModified: Date.now()
                },
                { new: true, upsert: true }
            );
        } else {
            // Create new scene
            scene = new Scene({
                userId: req.user.id,
                sceneObjects,
                cameraPosition,
                viewMode,
                name: `Scene ${Date.now()}`
            });
            await scene.save();
        }

        res.json({
            success: true,
            sceneId: scene._id,
            message: 'Scene saved successfully'
        });
    } catch (error) {
        console.error('Error saving scene:', error);
        res.status(500).json({ success: false, message: 'Failed to save scene' });
    }
});

// Load scene
router.get('/load/:sceneId', authenticateToken, async (req, res) => {
    try {
        const scene = await Scene.findOne({
            _id: req.params.sceneId,
            userId: req.user.id
        });

        if (!scene) {
            return res.status(404).json({ success: false, message: 'Scene not found' });
        }

        res.json({
            success: true,
            scene: {
                id: scene._id,
                sceneObjects: scene.sceneObjects,
                cameraPosition: scene.cameraPosition,
                viewMode: scene.viewMode,
                name: scene.name,
                lastModified: scene.lastModified
            }
        });
    } catch (error) {
        console.error('Error loading scene:', error);
        res.status(500).json({ success: false, message: 'Failed to load scene' });
    }
});

// Get all scenes for user
router.get('/list', authenticateToken, async (req, res) => {
    try {
        const scenes = await Scene.find({ userId: req.user.id })
            .select('_id name lastModified')
            .sort({ lastModified: -1 });

        res.json({
            success: true,
            scenes
        });
    } catch (error) {
        console.error('Error listing scenes:', error);
        res.status(500).json({ success: false, message: 'Failed to list scenes' });
    }
});

// Delete scene
router.delete('/delete/:sceneId', authenticateToken, async (req, res) => {
    try {
        await Scene.findOneAndDelete({
            _id: req.params.sceneId,
            userId: req.user.id
        });

        res.json({
            success: true,
            message: 'Scene deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting scene:', error);
        res.status(500).json({ success: false, message: 'Failed to delete scene' });
    }
});

module.exports = router;
