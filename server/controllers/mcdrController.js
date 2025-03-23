import { mCDR_trials } from '../models/models.js';

const getAllMCDR = async (req, res) => {
    try {
        const mcdr = await mCDR_trials.findAll();
        res.status(200).json({success: true, data: mcdr, count: mcdr.length});
    } catch (error) {
        res.status(500).json({ error: 'Failed to get MCDR' });
    }
};

const createMCDR = async (req, res) => {
    try {
        const mcdr = await mCDR_trials.create(req.body);
        res.status(201).json({success: true, data: mcdr});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create MCDR' });
    }
};

const getMCDRById = async (req, res) => {
    try {
        const mcdr = await mCDR_trials.findByPk(req.params.id);
        res.status(200).json({success: true, data: mcdr});
    } catch (error) {
        res.status(500).json({ error: 'Failed to get MCDR' });
    }
};  

const updateMCDR = async (req, res) => {
    try {
        const mcdr = await mCDR_trials.findByPk(req.params.id);
        if (!mcdr) {
            return res.status(404).json({ error: 'MCDR not found' });
        }
        await mcdr.update(req.body);
        res.status(200).json({success: true, data: mcdr});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update MCDR' });
    }
};

const deleteMCDR = async (req, res) => {
    try {   
        const mcdr = await mCDR_trials.findByPk(req.params.id);
        if (!mcdr) {
            return res.status(404).json({ error: 'MCDR not found' });
        }   
        await mcdr.destroy();
        res.status(204).json({success: true, message: 'MCDR deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete MCDR' });
    }
};



export default { getAllMCDR, getMCDRById, createMCDR, updateMCDR, deleteMCDR };
