import { Fundee, MCDR } from '../models/models.js';

// Get all fundees
const getAllFundees = async (req, res) => {
    try {
        const fundees = await Fundee.findAll();
        res.status(200).json(fundees);
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
        res.status(200).json(fundee);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fundee' });
    }
};

// Create a new fundee
const createFundee = async (req, res) => {
    try {
        const fundee = await Fundee.create(req.body);
        const mcdr = await MCDR.create({
            organizationName: fundee.organizationName,
            mcdr_methods: req.body.mcdr_methods,
            goal_description: req.body.goal_description,
            mrv_strategy: req.body.mrv_strategy,
            monitoring_platforms: req.body.monitoring_platforms
        });
        fundee.setMCDR(mcdr);
        res.status(201).json(fundee);
    } catch (error) {
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
        res.status(200).json(fundee);
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
        res.status(204).json({ message: 'Fundee deleted successfully' });   
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete fundee' });
    }
};

export default { getAllFundees, getFundeeById, createFundee, updateFundee, deleteFundee };
