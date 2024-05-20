import { Request, Response } from "express";
import receiverService from "../services/receiverService";
import { IListFilters } from "../utils/types";

const receiverController = {
  createCache: async (req: Request, res: Response) => {
    try {
      const response = await receiverService.createCache();
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  populateReceiver: async (req: Request, res: Response) => {
    try {
      const response = await receiverService.populateReceiver();
      res.status(response.status).json(response.message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  createReceiver: async (req: Request, res: Response) => {
    try {
      const response = await receiverService.createReceiver(req.body);
      res.status(response.status).json(response.message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  listReceivers: async (req: Request, res: Response) => {
    try {
      const response = await receiverService.listReceivers(
        req.query as unknown as IListFilters
      );
      res.status(response.status).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getReceiverById: async (req: Request, res: Response) => {
    try {
      const response = await receiverService.getReceiverById(req.params.id);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateReceiver: async (req: Request, res: Response) => {
    try {
      const response = await receiverService.updateReceiver(
        req.params.id,
        req.body
      );
      res.status(response.status).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteReceivers: async (req: Request, res: Response) => {
    try {
      const response = await receiverService.deleteReceivers(req.body.ids);
      res.status(response.status).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default receiverController;
