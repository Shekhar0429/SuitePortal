import  express  from 'express';
import  cors  from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import maintenanceRoute from './routes/maintenance.routes.js';
import adminRoutes from './routes/admin.routes.js'

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/maintenance-requests', maintenanceRoute);
app.use('/api/admin',adminRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});