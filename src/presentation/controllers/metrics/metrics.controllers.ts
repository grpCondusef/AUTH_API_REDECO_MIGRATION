import { Request, Response } from 'express';
import { client } from '../../../shared/utils/metrics';

export const metricsController = async (request: Request, response: Response) => {
  try {
    response.set('Content-Type', client.register.contentType);
    response.end(await client.register.metrics());
  } catch (error: any) {
    return response.status(500).json({
        status: "error",
        message: "Internal server error."
    });
  }
};
