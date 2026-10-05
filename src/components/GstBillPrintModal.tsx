import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { GstBillPrintTemplate, type GstBillPrintData } from './GstBillPrintTemplate';
import { printGstBillDirectly } from '../utils/printUtils';
import { shareBillViaWhatsApp, downloadBillAsPdf } from '../utils/pdfShareUtils';

interface GstBillPrintModalProps {
  open: boolean;
  onClose: () => void;
  bill: GstBillPrintData | null;
}

export const GstBillPrintModal: React.FC<GstBillPrintModalProps> = ({ open, onClose, bill }) => {
  const printAreaRef = React.useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = React.useState<boolean>(false);
  const [downloading, setDownloading] = React.useState<boolean>(false);

  if (!bill) return null;

  const handlePrint = () => {
    printGstBillDirectly(bill);
  };

  const handleShareWhatsApp = async () => {
    if (!printAreaRef.current) return;
    setSharing(true);
    try {
      await shareBillViaWhatsApp(printAreaRef.current, {
        billNo: bill.billNo,
        customerName: bill.customerName,
        customerPhone: bill.customerPhone,
        totalAmount: bill.total || bill.subtotal || 0,
        date: bill.date,
        companyName: bill.companyName || 'VAISHNAVI CRACKERS',
        isGst: true,
      });
    } catch (err) {
      console.error('Failed to share PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;
    setDownloading(true);
    try {
      await downloadBillAsPdf(printAreaRef.current, {
        billNo: bill.billNo,
        customerName: bill.customerName,
        customerPhone: bill.customerPhone,
        totalAmount: bill.total || bill.subtotal || 0,
        date: bill.date,
        companyName: bill.companyName || 'VAISHNAVI CRACKERS',
        isGst: true,
      });
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Hidden print styling for A4 GST invoice fallback */}
      <style>
        {`
          @media print {
            body {
              visibility: hidden !important;
              background-color: #FFFFFF !important;
            }
            .gst-printable-area,
            .gst-printable-area * {
              visibility: visible !important;
            }
            .MuiDialog-root,
            .MuiDialog-container,
            .MuiDialog-paper,
            .MuiDialogContent-root {
              visibility: visible !important;
              position: static !important;
              display: block !important;
              max-height: none !important;
              height: auto !important;
              overflow: visible !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
              background: transparent !important;
            }
            .MuiBackdrop-root,
            .gst-no-print {
              display: none !important;
            }
            .gst-printable-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              background-color: #FFFFFF !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .gst-print-copy {
              page-break-after: auto !important;
              break-after: auto !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              width: 100% !important;
            }
            .gst-print-copy:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }
            @page {
              size: A4 portrait;
              margin: 5mm 6mm;
            }
          }
        `}
      </style>

      {/* Screen Dialog */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        {/* Modal Top Bar */}
        <Box
          className="gst-no-print"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3 },
            py: 1.8,
            gap: { xs: 1.2, sm: 0 },
            background: 'linear-gradient(135deg, #0B0F19 0%, #111827 40%, #1E3A8A 100%)',
            borderBottom: '2.5px solid #EAB308',
            color: '#FFFFFF',
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                GST Tax Invoice - #{bill.billNo || 'New'}
              </Typography>
              <IconButton onClick={onClose} sx={{ display: { xs: 'flex', sm: 'none' }, color: '#FFFFFF', p: 0.5 }}>
                <CloseRoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: '12px', color: '#FACC15', fontWeight: 600 }}>
              Customer: {bill.customerName || 'Walk-in'} | Date: {bill.date}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
            <Button
              variant="contained"
              disableElevation
              onClick={handlePrint}
              startIcon={<PrintOutlinedIcon sx={{ fontSize: '18px !important', color: '#0B0F19' }} />}
              sx={{
                flex: { xs: 1, sm: 'none' },
                backgroundColor: '#FACC15',
                color: '#0B0F19',
                border: '1.5px solid #EAB308',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'none',
                px: 2,
                py: 0.6,
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: '#EAB308',
                },
              }}
            >
              Print Tax Invoice
            </Button>
            <IconButton onClick={onClose} sx={{ display: { xs: 'none', sm: 'flex' }, color: '#FFFFFF', p: 0.5 }}>
              <CloseRoundedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Single Copy Indicator Bar */}
        <Box
          className="gst-no-print"
          sx={{
            px: 3,
            py: 1.2,
            backgroundColor: '#EFF6FF',
            borderBottom: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LayersOutlinedIcon sx={{ fontSize: 18, color: '#1D4ED8' }} />
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1E3A8A' }}>
              Print Output:
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#1E40AF', fontWeight: 500 }}>
              Single Copy (ORIGINAL) • Exact Composition Scheme Format
            </Typography>
          </Box>
          <Chip
            size="small"
            label="Single Copy (ORIGINAL)"
            sx={{
              backgroundColor: '#1D4ED8',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '11px',
            }}
          />
        </Box>

        {/* Print Preview Content */}
        <DialogContent
          sx={{
            p: { xs: 1, sm: 3 },
            backgroundColor: '#F1F5F9',
            maxHeight: '75vh',
            overflowY: 'auto',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Box ref={printAreaRef} className="gst-printable-area">
            {/* Single Copy: ORIGINAL */}
            <Box className="gst-print-copy">
              <GstBillPrintTemplate bill={bill} copyLabel="ORIGINAL" />
            </Box>
          </Box>
        </DialogContent>

        {/* Modal Action Bar */}
        <DialogActions
          className="gst-no-print"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 1.5,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: '#475569',
              borderColor: '#CBD5E1',
              py: 1,
              '&:hover': { borderColor: '#94A3B8', backgroundColor: '#F8FAFC' },
            }}
          >
            Close Preview
          </Button>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.2,
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Button
              onClick={handleDownloadPdf}
              variant="outlined"
              disabled={downloading || sharing}
              startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfRoundedIcon />}
              sx={{
                color: '#1D4ED8',
                borderColor: '#93C5FD',
                px: 2,
                py: 1,
                fontWeight: 700,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
              }}
            >
              {downloading ? 'Creating PDF...' : 'Download PDF'}
            </Button>

            <Button
              onClick={handleShareWhatsApp}
              variant="contained"
              disabled={sharing || downloading}
              startIcon={sharing ? <CircularProgress size={16} sx={{ color: '#FFFFFF' }} /> : <WhatsAppIcon />}
              sx={{
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                px: 2.5,
                py: 1.1,
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { backgroundColor: '#15803D' },
              }}
            >
              {sharing ? 'Generating PDF...' : 'Share on WhatsApp (PDF)'}
            </Button>

            <Button
              onClick={handlePrint}
              variant="contained"
              startIcon={<PrintOutlinedIcon />}
              sx={{
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                color: '#FFFFFF',
                px: 2.5,
                py: 1.1,
                fontWeight: 800,
                borderRadius: '6px',
                border: '1.5px solid #FACC15',
                boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': { background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' },
              }}
            >
              Print Tax Invoice
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};
