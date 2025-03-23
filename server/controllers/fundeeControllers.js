import { Fundee } from '../models/models.js';

// Get all fundees
const getAllFundees = async (req, res) => {
    try {
        const fundees = await Fundee.findAll();
        console.log(fundees);
        res.status(200).json({success: true, data: fundees, count: fundees.length});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fundees' });
    }
};

// Get fundee by ID
const getFundeeById = async (req, res) => {
    try {
        const fundee = await Fundee.findByPk(req.params.id);
        if (!fundee) {
            return res.status(404).json({ error: 'Fundee not found' });
        }
        res.status(200).json({success: true, data: fundee});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fundee' });
    }
};

// Create a new fundee
const createFundee = async (req, res) => {
    console.log(req.body);
    try {
        const fundee = await Fundee.create(req.body);
        console.log(fundee);
        res.status(201).json({success: true, data: fundee});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create fundee' }); 
    }
};

// Update a fundee
const updateFundee = async (req, res) => {
    try {
        const fundee = await Fundee.findByPk(req.params.id);
        if (!fundee) {
            return res.status(404).json({ error: 'Fundee not found' });
        }
        await fundee.update(req.body);
        res.status(200).json({success: true, data: fundee});
    } catch (error) { 
        res.status(500).json({ error: 'Failed to update fundee' });
    }
};

// Delete a fundee
const deleteFundee = async (req, res) => {
    try {
        const fundee = await Fundee.findByPk(req.params.id);
        if (!fundee) {
            return res.status(404).json({ error: 'Fundee not found' });
        }
        await fundee.destroy();
        res.status(204).json({success: true, message: 'Fundee deleted successfully' });   
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete fundee' });
    }
};

export default { getAllFundees, getFundeeById, createFundee, updateFundee, deleteFundee };
