import express from 'express';
import cors from 'cors';
import complianceRoutes from './routes/complianceRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/compliance', complianceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
