import { Router } from 'express';
import {
  getAllEWayBills,
  getEWayBillById,
  createEWayBill,
  updateEWayBill,
  deleteEWayBill,
} from '../controllers/ewayBillController';

const router = Router();

router.get('/', getAllEWayBills);
router.get('/:id', getEWayBillById);
router.post('/', createEWayBill);
router.put('/:id', updateEWayBill);
router.delete('/:id', deleteEWayBill);

export default router;
