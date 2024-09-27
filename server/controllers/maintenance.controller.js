import { Low, JSONFile } from 'lowdb';

const file = new JSONFile('db.json');
const db = new Low(file);
await db.read();

db.data = { maintenanceRequests: [], admins: [] };

// Controller function to create new requests.
export const createMaintenanceRequest = async (req, res) => {
  const newRequest = { ...req.body, id: Date.now().toString(), status: 'open', createdAt: new Date() };
  db.data.maintenanceRequests.push(newRequest);
  await db.write();
  res.status(201).json(newRequest);
};

// Controller function to get all open requests.
export const getMaintenanceRequests = async (req, res) => {
  await db.read();
  const openRequests = db.data.maintenanceRequests.filter((request) => request.status === 'open');
  res.json(openRequests);
};

// Controller function to close a request
export const closeMaintenanceRequest = async (req, res) => {
  await db.read();
  const { id } = req.params;
  const requestIndex = db.data.maintenanceRequests.findIndex((request) => request.id === id);

  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Maintenance request not found' });
  }

  db.data.maintenanceRequests[requestIndex].status = 'closed';
  await db.write();
  res.json(db.data.maintenanceRequests[requestIndex]);
};
