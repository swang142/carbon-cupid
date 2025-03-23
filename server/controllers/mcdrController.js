import { MCDR } from '../models/models';

export const createMCDR = async (req, res) => {
    try {
        const mcdr = await MCDR.create(req.body);
        res.status(201).json(mcdr);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create MCDR' });
    }
};

export const getMCDRById = async (req, res) => {
    try {
        const mcdr = await MCDR.findByPk(req.params.id);
        res.status(200).json(mcdr);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get MCDR' });
    }
};  

export const updateMCDR = async (req, res) => {
    try {
        const mcdr = await MCDR.findByPk(req.params.id);
        if (!mcdr) {
            return res.status(404).json({ error: 'MCDR not found' });
        }
        await mcdr.update(req.body);
        res.status(200).json(mcdr);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update MCDR' });
    }
};

export const deleteMCDR = async (req, res) => {
    try {   
        const mcdr = await MCDR.findByPk(req.params.id);
        if (!mcdr) {
            return res.status(404).json({ error: 'MCDR not found' });
        }   
        await mcdr.destroy();
        res.status(204).json({ message: 'MCDR deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete MCDR' });
    }
};



