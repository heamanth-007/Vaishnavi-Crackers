import { Request, Response, NextFunction } from 'express';
import { EWayBill } from '../models/EWayBill';

export const getAllEWayBills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query;
    const filter: any = {};

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = search.trim();
      filter.$or = [
        { ewayBillNo: { $regex: term, $options: 'i' } },
        { documentNo: { $regex: term, $options: 'i' } },
        { recipientGstin: { $regex: term, $options: 'i' } },
        { supplierGstin: { $regex: term, $options: 'i' } },
        { vehicleDocNo: { $regex: term, $options: 'i' } },
      ];
    }

    const bills = await EWayBill.find(filter).sort({ createdAt: -1, _id: -1 });
    res.status(200).json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    next(error);
  }
};

export const getEWayBillById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bill = await EWayBill.findById(req.params.id);
    if (!bill) {
      res.status(404).json({ success: false, error: 'e-Way Bill not found' });
      return;
    }
    res.status(200).json({ success: true, data: bill });
  } catch (error) {
    next(error);
  }
};

export const createEWayBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let {
      ewayBillNo,
      ewayBillDate,
      generatedBy,
      validFrom,
      validUntil,
      portal,
      supplierGstin,
      placeOfDispatch,
      recipientGstin,
      placeOfDelivery,
      documentNo,
      documentDate,
      transactionType,
      valueOfGoods,
      hsnCode,
      reasonForTransportation,
      transporter,
      mode,
      vehicleDocNo,
      fromPlace,
      enteredDate,
      enteredBy,
      cewbNo,
      multiVehInfo,
      partBPortal,
      notes,
    } = req.body;

    // Auto generate 12 digit format if not provided: e.g. 5120 7062 3138
    if (!ewayBillNo || ewayBillNo.trim() === '') {
      const randGroup1 = Math.floor(1000 + Math.random() * 9000);
      const randGroup2 = Math.floor(1000 + Math.random() * 9000);
      const randGroup3 = Math.floor(1000 + Math.random() * 9000);
      ewayBillNo = `${randGroup1} ${randGroup2} ${randGroup3}`;
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    const formattedMinutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;
    const fullDateTime = `${formattedDate} ${timeStr}`;

    if (!ewayBillDate) ewayBillDate = fullDateTime;
    if (!validFrom) validFrom = `${fullDateTime} [100Kms]`;
    if (!validUntil) {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      validUntil = `${String(tomorrow.getDate()).padStart(2, '0')}/${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${tomorrow.getFullYear()}`;
    }
    if (!enteredDate) enteredDate = fullDateTime;

    const newBill = await EWayBill.create({
      ewayBillNo,
      ewayBillDate,
      generatedBy,
      validFrom,
      validUntil,
      portal: portal || '1',
      supplierGstin,
      placeOfDispatch,
      recipientGstin,
      placeOfDelivery,
      documentNo,
      documentDate: documentDate || formattedDate,
      transactionType: transactionType || 'Regular',
      valueOfGoods: String(valueOfGoods || '0'),
      hsnCode: hsnCode || '3604 - FIRE WORKS',
      reasonForTransportation: reasonForTransportation || 'Outward - Supply',
      transporter: transporter || '',
      mode: mode || 'Road',
      vehicleDocNo: vehicleDocNo || '',
      fromPlace: fromPlace || '',
      enteredDate: enteredDate || fullDateTime,
      enteredBy: enteredBy || (supplierGstin ? supplierGstin.split(',')[0].trim() : ''),
      cewbNo: cewbNo || '-',
      multiVehInfo: multiVehInfo || '-',
      partBPortal: partBPortal || '1',
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: newBill });
  } catch (error) {
    next(error);
  }
};

export const updateEWayBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await EWayBill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404).json({ success: false, error: 'e-Way Bill not found' });
      return;
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteEWayBill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await EWayBill.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'e-Way Bill not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'e-Way Bill deleted successfully' });
  } catch (error) {
    next(error);
  }
};
