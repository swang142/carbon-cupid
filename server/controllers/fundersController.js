import { Funders } from '../models/models.js';

const getAllFunders = async (req, res) => {
    try {
        const funders = await Funders.findAll();
        res.status(200).json({success: true, data: funders, count: funders.length});
    } catch (error) {
        res.status(500).json({ error: 'Failed to get funders' });
    }
};

const getFunderById = async (req, res) => {
    try {
        const funder = await Funders.findByPk(req.params.id);
        res.status(200).json({success: true, data: funder});
    } catch (error) {
        res.status(500).json({ error: 'Failed to get funder' });
    }
};  

const createFunder = async (req, res) => {
    try {
        const funder = await Funders.create(req.body);
        res.status(201).json({success: true, data: funder});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to create funder' });
    }
};

const updateFunder = async (req, res) => {
    try {
        const funder = await Funders.findByPk(req.params.id);
        if (!funder) {
            return res.status(404).json({ error: 'Funder not found' });
        }
        await funder.update(req.body);
        res.status(200).json({success: true, data: funder});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update funder' });
    }
}

const deleteFunder = async (req, res) => {
    try {
        const funder = await Funders.findByPk(req.params.id);
        if (!funder) {
            return res.status(404).json({ error: 'Funder not found' });
        }
        await funder.destroy();
        res.status(204).json({success: true, message: 'Funder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete funder' });
    }
}

export default { getAllFunders, getFunderById, createFunder, updateFunder, deleteFunder };
