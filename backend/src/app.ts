import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import listRoutes from './routes/list.routes';
import facilityRoutes from './routes/facility.routes';
import ergBrandRoutes from './routes/ergBrand.routes';
import chainRoutes from './routes/chain.routes';

const app = express();

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5200')
  .split(',')
  .map((value) => value.trim())
  .filter((value) => value.length > 0);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/list', listRoutes);
app.use('/facilities', facilityRoutes);
app.use('/erg-brands', ergBrandRoutes);
app.use('/chains', chainRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

