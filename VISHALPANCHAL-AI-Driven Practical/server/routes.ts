import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { shiftsService } from "./services/shifts.service";
import { 
  CreateShiftDto, 
  UpdateShiftDto, 
  FilterShiftsByPriceDto,
  FilterShiftsByTypeDto,
  CheckOverlappingShiftsDto 
} from "./dtos/shift.dto";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to handle validation errors
  const validateRequest = (schema: any) => (req: Request, res: Response, next: Function) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: validationError.details 
        });
      }
      next(error);
    }
  };

  // API routes
  app.get('/api/shifts', async (req, res) => {
    try {
      const shifts = await shiftsService.getAllShifts();
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch shifts', error: (error as Error).message });
    }
  });

  app.get('/api/shifts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const shift = await shiftsService.getShift(id);
      if (!shift) {
        return res.status(404).json({ message: 'Shift not found' });
      }
      
      res.json(shift);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch shift', error: (error as Error).message });
    }
  });

  app.post('/api/shifts/filter/price', validateRequest(FilterShiftsByPriceDto), async (req, res) => {
    try {
      const { minPrice, maxPrice } = req.body;
      const shifts = await shiftsService.getShiftsByPriceRange(minPrice, maxPrice);
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to filter shifts by price', error: (error as Error).message });
    }
  });

  app.post('/api/shifts/filter/type', validateRequest(FilterShiftsByTypeDto), async (req, res) => {
    try {
      const { type } = req.body;
      const shifts = await shiftsService.getShiftsByType(type);
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to filter shifts by type', error: (error as Error).message });
    }
  });

  app.post('/api/shifts/check-overlap', validateRequest(CheckOverlappingShiftsDto), async (req, res) => {
    try {
      const result = await shiftsService.checkOverlappingShifts(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to check for overlapping shifts', error: (error as Error).message });
    }
  });

  app.post('/api/shifts', validateRequest(CreateShiftDto), async (req, res) => {
    try {
      const newShift = await shiftsService.createShift(req.body);
      res.status(201).json(newShift);
    } catch (error) {
      if ((error as Error).message.includes('Overlapping shift exists')) {
        return res.status(409).json({ message: (error as Error).message });
      }
      res.status(500).json({ message: 'Failed to create shift', error: (error as Error).message });
    }
  });

  app.put('/api/shifts/:id', validateRequest(UpdateShiftDto), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const updatedShift = await shiftsService.updateShift(id, req.body);
      res.json(updatedShift);
    } catch (error) {
      if ((error as Error).message.includes('Overlapping shift exists')) {
        return res.status(409).json({ message: (error as Error).message });
      }
      if ((error as Error).message.includes('not found')) {
        return res.status(404).json({ message: (error as Error).message });
      }
      res.status(500).json({ message: 'Failed to update shift', error: (error as Error).message });
    }
  });

  app.delete('/api/shifts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const success = await shiftsService.deleteShift(id);
      if (!success) {
        return res.status(404).json({ message: 'Shift not found' });
      }
      
      res.json({ message: 'Shift deleted successfully' });
    } catch (error) {
      if ((error as Error).message.includes('not found')) {
        return res.status(404).json({ message: (error as Error).message });
      }
      res.status(500).json({ message: 'Failed to delete shift', error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
