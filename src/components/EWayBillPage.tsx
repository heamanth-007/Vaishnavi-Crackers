import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';

import { EWayBillsApi, CustomersApi, ParticularsApi } from '../services/api';
import { getStoredSettings } from './SettingsPage';
import { EWayBillPrintModal } from './EWayBillPrintModal';
import type { EWayBillData } from './EWayBillPrintTemplate';

export const EWayBillPage: React.FC = () => {
  const [bills, setBills] = useState<EWayBillData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [editingBill, setEditingBill] = useState<EWayBillData | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState<EWayBillData | null>(null);

  // Quick autofill data sources
  const [customers, setCustomers] = useState<any[]>([]);
  const [recentParticulars, setRecentParticulars] = useState<any[]>([]);

  // Form State
  const initialFormState: EWayBillData = {
    ewayBillNo: '',
    ewayBillDate: '',
    generatedBy: '',
    validFrom: '',
    validUntil: '',
    portal: '1',

    // Part - A
    supplierGstin: '',
    placeOfDispatch: '',
    recipientGstin: '',
    placeOfDelivery: '',
    documentNo: '',
    documentDate: '',
    transactionType: 'Regular',
    valueOfGoods: '',
    hsnCode: '3604 - FIRE WORKS',
    reasonForTransportation: 'Outward - Supply',
    transporter: '',

    // Part - B
    mode: 'Road',
    vehicleDocNo: '',
    fromPlace: '',
    enteredDate: '',
    enteredBy: '',
    cewbNo: '-',
    multiVehInfo: '-',
    partBPortal: '1',
    notes: '',
  };

  const [formData, setFormData] = useState<EWayBillData>(initialFormState);
  const [saving, setSaving] = useState<boolean>(false);

  // Load all e-Way bills
  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await EWayBillsApi.getAll(search);
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch e-Way bills:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load helper data for autofill
  useEffect(() => {
    fetchBills();
    CustomersApi.getAll().then((res) => setCustomers(Array.isArray(res) ? res : [])).catch(() => {});
    ParticularsApi.getAll().then((res) => setRecentParticulars(Array.isArray(res) ? res.slice(0, 30) : [])).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreateModal = () => {
    const storeSettings = getStoredSettings();
    const now = new Date();
    const dStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0');
    const formattedMinutes = String(now.getMinutes()).padStart(2, '0');
    const fullDateTime = `${dStr} ${formattedHours}:${formattedMinutes} ${ampm}`;

    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomStr = `${String(tomorrow.getDate()).padStart(2, '0')}/${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${tomorrow.getFullYear()}`;

    const rand1 = Math.floor(1000 + Math.random() * 9000);
    const rand2 = Math.floor(1000 + Math.random() * 9000);
    const rand3 = Math.floor(1000 + Math.random() * 9000);
    const generatedEwbNo = `${rand1} ${rand2} ${rand3}`;

    const gstin = storeSettings.gstin || '33AEDFS1259N1ZS';
    const compName = storeSettings.companyName || 'Vaishnavi Crackers';
    const dispPlace = `${storeSettings.city || 'Sivakasi'}, ${storeSettings.state || 'TAMIL NADU'}-${storeSettings.pincode || '626123'}`;

    setEditingBill(null);
    setFormData({
      ...initialFormState,
      ewayBillNo: generatedEwbNo,
      ewayBillDate: fullDateTime,
      generatedBy: `${gstin} - ${compName.toUpperCase()}`,
      validFrom: `${fullDateTime} [100Kms]`,
      validUntil: tomStr,
      supplierGstin: `${gstin}, ${compName.toUpperCase()}`,
      placeOfDispatch: dispPlace,
      fromPlace: storeSettings.city || 'Sivakasi',
      enteredDate: fullDateTime,
      enteredBy: gstin,
      documentDate: dStr,
    });
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (bill: EWayBillData) => {
    setEditingBill(bill);
    setFormData({ ...bill });
    setFormModalOpen(true);
  };

  const handleAutofillFromCustomer = (custName: string) => {
    if (!custName) return;
    const match = customers.find((c) => c.name === custName);
    if (match) {
      const gstinVal = match.gst && match.gst !== 'N/A' && match.gst !== '-' ? match.gst : 'URP';
      const placeVal = `${match.address || match.city || 'Sattur'}, TAMIL NADU-626203`;
      setFormData((prev) => ({
        ...prev,
        recipientGstin: `${gstinVal}, ${match.name}`,
        placeOfDelivery: placeVal,
      }));
    }
  };

  const handleAutofillFromBill = (billNoVal: string) => {
    if (!billNoVal) return;
    const match = recentParticulars.find((b) => String(b.billNo) === String(billNoVal));
    if (match) {
      const gstinVal = match.customerGst && match.customerGst !== 'N/A' ? match.customerGst : 'URP';
      const placeVal = match.customerAddress || `${match.customerCity || 'Sattur'}, TAMIL NADU`;
      setFormData((prev) => ({
        ...prev,
        documentNo: String(match.billNo || ''),
        documentDate: match.date || prev.documentDate,
        valueOfGoods: String(match.total || match.amount || '0'),
        recipientGstin: `${gstinVal}, ${match.customerName || ''}`,
        placeOfDelivery: placeVal,
        vehicleDocNo: match.vehicleNo || prev.vehicleDocNo,
      }));
    }
  };

  const handleSaveForm = async (andPrint = false) => {
    if (!formData.supplierGstin || !formData.recipientGstin || !formData.documentNo) {
      alert('Please fill in Supplier GSTIN, Recipient GSTIN and Document No.');
      return;
    }

    try {
      setSaving(true);
      let savedData: EWayBillData;
      if (editingBill && (editingBill._id || editingBill.id)) {
        const id = editingBill._id || editingBill.id;
        savedData = await EWayBillsApi.update(id!, formData);
      } else {
        savedData = await EWayBillsApi.create(formData);
      }

      setFormModalOpen(false);
      fetchBills();

      if (andPrint) {
        setSelectedBillForPrint(savedData || formData);
        setPrintModalOpen(true);
      }
    } catch (err: any) {
      console.error('Failed to save e-Way bill:', err);
      alert(err?.message || 'Failed to save e-Way bill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, ewbNo: string) => {
    if (!window.confirm(`Are you sure you want to delete e-Way Bill #${ewbNo}?`)) return;
    try {
      await EWayBillsApi.delete(id);
      fetchBills();
    } catch (err) {
      console.error('Failed to delete e-Way bill:', err);
      alert('Failed to delete e-Way bill');
    }
  };

  const handlePrintBill = (bill: EWayBillData) => {
    setSelectedBillForPrint(bill);
    setPrintModalOpen(true);
  };

  // Stats calculation
  const totalBillsCount = bills.length;
  const totalValueOfGoods = bills.reduce((acc, b) => acc + (parseFloat(String(b.valueOfGoods || 0)) || 0), 0);

  return (
    <Box sx={{ width: '100%', px: { xs: 1.5, sm: 2.5, md: 3 }, py: 1.5, boxSizing: 'border-box' }}>
      {/* Top Banner / Summary */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 2,
          borderRadius: '14px',
          border: '1.5px solid #E2E8F0',
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalShippingRoundedIcon sx={{ fontSize: 28, color: '#38BDF8' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: { xs: '18px', sm: '21px' }, fontWeight: 800, letterSpacing: '0.3px' }}>
              e-Way Bill Management
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#94A3B8', fontWeight: 500 }}>
              Generate, print and manage official Part-A &amp; Part-B e-Way transportation invoices
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="contained"
            onClick={handleOpenCreateModal}
            startIcon={<AddRoundedIcon />}
            sx={{
              backgroundColor: '#38BDF8',
              color: '#0F172A',
              fontWeight: 800,
              px: 2.5,
              py: 1,
              borderRadius: '10px',
              fontSize: '13px',
              '&:hover': { backgroundColor: '#0284C7', color: '#FFFFFF' },
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            Generate e-Way Bill
          </Button>
          <IconButton onClick={fetchBills} sx={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.2)' }}>
            <RefreshRoundedIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Summary KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={0} sx={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Total e-Way Bills
              </Typography>
              <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', mt: 0.5 }}>
                {totalBillsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={0} sx={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Total Transport Value (₹)
              </Typography>
              <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#0284C7', mt: 0.5 }}>
                ₹ {totalValueOfGoods.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Standard HSN Code
              </Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#10B981', mt: 0.5 }}>
                3604 - FIRE WORKS
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter / Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 2,
          borderRadius: '12px',
          border: '1.5px solid #E2E8F0',
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TextField
          size="small"
          placeholder="Search by e-Way Bill No, Document No, Recipient, Vehicle No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchBills()}
          sx={{ flexGrow: 1, '& .MuiInputBase-input': { fontSize: '13.5px' } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          onClick={fetchBills}
          sx={{
            backgroundColor: '#1E293B',
            fontWeight: 700,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '13px',
          }}
        >
          Search
        </Button>
      </Paper>

      {/* Data Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '14px',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: '#F8FAFC', fontWeight: 800, fontSize: '12px', color: '#475569' } }}>
                <TableCell>E-Way Bill No</TableCell>
                <TableCell>Date &amp; Time</TableCell>
                <TableCell>Recipient (Billed To)</TableCell>
                <TableCell>Place of Delivery</TableCell>
                <TableCell>Doc No</TableCell>
                <TableCell>Value (₹)</TableCell>
                <TableCell>Vehicle No</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                    <Typography sx={{ mt: 1, fontSize: '13px', color: '#64748B' }}>
                      Loading e-Way bills...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : bills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <DescriptionRoundedIcon sx={{ fontSize: 44, color: '#CBD5E1', mb: 1 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#475569' }}>
                      No e-Way Bills found
                    </Typography>
                    <Typography sx={{ fontSize: '12.5px', color: '#94A3B8', mt: 0.5 }}>
                      Click "Generate e-Way Bill" to create your first transportation bill.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((b) => (
                  <TableRow key={b._id || b.id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                    <TableCell sx={{ fontWeight: 800, color: '#1E293B', fontSize: '13px' }}>
                      {b.ewayBillNo}
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px', color: '#64748B' }}>
                      {b.ewayBillDate}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A', fontSize: '12.5px', maxWidth: 220 }}>
                      {b.recipientGstin}
                    </TableCell>
                    <TableCell sx={{ fontSize: '12px', color: '#475569' }}>
                      {b.placeOfDelivery}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0284C7' }}>
                      #{b.documentNo}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#059669', fontSize: '13px' }}>
                      ₹ {parseFloat(String(b.valueOfGoods || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={b.vehicleDocNo || 'Not Assigned'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '11px',
                          backgroundColor: b.vehicleDocNo ? '#EFF6FF' : '#F1F5F9',
                          color: b.vehicleDocNo ? '#1D4ED8' : '#64748B',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="Print / Preview e-Way Bill" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handlePrintBill(b)}
                            sx={{ color: '#1E293B', '&:hover': { backgroundColor: '#F1F5F9' } }}
                          >
                            <PrintOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit e-Way Bill" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditModal(b)}
                            sx={{ color: '#0284C7', '&:hover': { backgroundColor: '#E0F2FE' } }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(b._id || b.id || '', b.ewayBillNo)}
                            sx={{ color: '#EF4444', '&:hover': { backgroundColor: '#FEE2E2' } }}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create / Edit Form Dialog */}
      <Dialog
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        maxWidth="lg"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px', overflow: 'hidden' } } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            py: 1.8,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalShippingRoundedIcon sx={{ color: '#38BDF8' }} />
            <Typography sx={{ fontWeight: 800, fontSize: '17px' }}>
              {editingBill ? `Edit e-Way Bill #${formData.ewayBillNo}` : 'Generate Official e-Way Bill'}
            </Typography>
          </Box>
          <IconButton onClick={() => setFormModalOpen(false)} size="small" sx={{ color: '#94A3B8' }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, backgroundColor: '#F8FAFC' }}>
          {/* Quick Autofill Selector */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: '12px',
              border: '1.5px solid #BAE6FD',
              backgroundColor: '#F0F9FF',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FlashOnRoundedIcon sx={{ color: '#0284C7', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 800, fontSize: '13px', color: '#0369A1' }}>
                Quick Autofill Helpers
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Autofill from Existing Customer"
                  defaultValue=""
                  onChange={(e) => handleAutofillFromCustomer(e.target.value)}
                  sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                >
                  <MenuItem value="">-- Select Customer --</MenuItem>
                  {customers.map((c) => (
                    <MenuItem key={c._id || c.id} value={c.name}>
                      {c.name} {c.gst && c.gst !== 'N/A' ? `(${c.gst})` : ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Autofill from Recent Bill / Invoice"
                  defaultValue=""
                  onChange={(e) => handleAutofillFromBill(e.target.value)}
                  sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
                >
                  <MenuItem value="">-- Select Bill No --</MenuItem>
                  {recentParticulars.map((b) => (
                    <MenuItem key={b._id || b.id} value={String(b.billNo)}>
                      Bill #{b.billNo} - {b.customerName} (₹{b.total || b.amount})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Section: Document Metadata */}
          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E293B', mb: 1.5 }}>
            📋 Header &amp; Validity Metadata
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="E-Way Bill No"
                value={formData.ewayBillNo}
                onChange={(e) => setFormData({ ...formData, ewayBillNo: e.target.value })}
                placeholder="e.g. 5120 7062 3138"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="E-Way Bill Date & Time"
                value={formData.ewayBillDate}
                onChange={(e) => setFormData({ ...formData, ewayBillDate: e.target.value })}
                placeholder="DD/MM/YYYY hh:mm AM/PM"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Generated By"
                value={formData.generatedBy}
                onChange={(e) => setFormData({ ...formData, generatedBy: e.target.value })}
                placeholder="GSTIN - Company Name"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Valid From [Distance Kms]"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                placeholder="11/09/2026 05:40 PM [100Kms]"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Valid Until Date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                placeholder="12/09/2026"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Portal"
                value={formData.portal}
                onChange={(e) => setFormData({ ...formData, portal: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Section: Part - A Details */}
          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E293B', mb: 1.5 }}>
            🏢 Part - A: Consignor, Consignee &amp; Goods Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="GSTIN of Supplier & Name *"
                value={formData.supplierGstin}
                onChange={(e) => setFormData({ ...formData, supplierGstin: e.target.value })}
                placeholder="33AEDFS1259N1ZS, SRI PONSASTHA FIREWORKS"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Place of Dispatch *"
                value={formData.placeOfDispatch}
                onChange={(e) => setFormData({ ...formData, placeOfDispatch: e.target.value })}
                placeholder="Virudhunagar, TAMIL NADU-626203"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="GSTIN of Recipient & Name *"
                value={formData.recipientGstin}
                onChange={(e) => setFormData({ ...formData, recipientGstin: e.target.value })}
                placeholder="33CRMPS1095L1Z7, Vaishnavi Pattasu Kadai"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Place of Delivery *"
                value={formData.placeOfDelivery}
                onChange={(e) => setFormData({ ...formData, placeOfDelivery: e.target.value })}
                placeholder="Sattur, TAMIL NADU-626203"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Document No (Bill / Invoice No) *"
                value={formData.documentNo}
                onChange={(e) => setFormData({ ...formData, documentNo: e.target.value })}
                placeholder="e.g. 292"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Document Date *"
                value={formData.documentDate}
                onChange={(e) => setFormData({ ...formData, documentDate: e.target.value })}
                placeholder="11/09/2026"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Transaction Type"
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                placeholder="Regular"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Value of Goods (₹) *"
                value={formData.valueOfGoods}
                onChange={(e) => setFormData({ ...formData, valueOfGoods: e.target.value })}
                placeholder="e.g. 39204"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="HSN Code *"
                value={formData.hsnCode}
                onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                placeholder="3604 - FIRE WORKS"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Reason for Transportation"
                value={formData.reasonForTransportation}
                onChange={(e) => setFormData({ ...formData, reasonForTransportation: e.target.value })}
                placeholder="Outward - Supply"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Transporter Name / Transporter ID (Optional)"
                value={formData.transporter}
                onChange={(e) => setFormData({ ...formData, transporter: e.target.value })}
                placeholder="e.g. VRL Logistics / TN Transporter"
              />
            </Grid>
          </Grid>

          {/* Section: Part - B Details */}
          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#1E293B', mb: 1.5 }}>
            🚚 Part - B: Vehicle &amp; Transport Mode Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Mode"
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              >
                <MenuItem value="Road">Road</MenuItem>
                <MenuItem value="Rail">Rail</MenuItem>
                <MenuItem value="Air">Air</MenuItem>
                <MenuItem value="Ship">Ship</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Vehicle / Trans Doc No & Dt."
                value={formData.vehicleDocNo}
                onChange={(e) => setFormData({ ...formData, vehicleDocNo: e.target.value })}
                placeholder="e.g. TN69VS769"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="From Place"
                value={formData.fromPlace}
                onChange={(e) => setFormData({ ...formData, fromPlace: e.target.value })}
                placeholder="e.g. Virudhunagar"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Entered By (GSTIN / ID)"
                value={formData.enteredBy}
                onChange={(e) => setFormData({ ...formData, enteredBy: e.target.value })}
                placeholder="33AEDFS1259N1ZS"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            px: 3,
            py: 2,
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={() => setFormModalOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{ fontWeight: 700, borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              onClick={() => handleSaveForm(false)}
              variant="outlined"
              disabled={saving}
              sx={{ fontWeight: 800, borderRadius: '8px', px: 2.5 }}
            >
              {saving ? 'Saving...' : 'Save e-Way Bill'}
            </Button>
            <Button
              onClick={() => handleSaveForm(true)}
              variant="contained"
              disabled={saving}
              startIcon={<PrintOutlinedIcon />}
              sx={{
                backgroundColor: '#0284C7',
                '&:hover': { backgroundColor: '#0369A1' },
                fontWeight: 800,
                borderRadius: '8px',
                px: 3,
              }}
            >
              {saving ? 'Saving...' : 'Save & Print'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Print / Preview Dialog */}
      <EWayBillPrintModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        bill={selectedBillForPrint}
      />
    </Box>
  );
};
