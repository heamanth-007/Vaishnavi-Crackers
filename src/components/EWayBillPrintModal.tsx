import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { EWayBillPrintTemplate, type EWayBillData } from './EWayBillPrintTemplate';

interface EWayBillPrintModalProps {
  open: boolean;
  onClose: () => void;
  bill: EWayBillData | null;
}

export const EWayBillPrintModal: React.FC<EWayBillPrintModalProps> = ({ open, onClose, bill }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!bill) return null;

  const handlePrint = () => {
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>e-Way Bill - ${bill.ewayBillNo}</title>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 10mm 15mm;
              background: #FFFFFF;
            }
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 300);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            maxHeight: '94vh',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          py: 1.5,
          px: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>
            e-Way Bill Preview
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
            E-Way Bill No: #{bill.ewayBillNo} | Doc: {bill.documentNo}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748B' }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: '#E2E8F0',
          p: { xs: 1, sm: 2.5 },
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <Box
          ref={printAreaRef}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            width: '100%',
            maxWidth: '780px',
            p: 2,
          }}
        >
          <EWayBillPrintTemplate bill={bill} />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          px: 3,
          py: 1.5,
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ fontWeight: 700, borderRadius: '8px' }}>
          Close
        </Button>
        <Button
          onClick={handlePrint}
          variant="contained"
          startIcon={<PrintOutlinedIcon />}
          sx={{
            backgroundColor: '#1E293B',
            '&:hover': { backgroundColor: '#0F172A' },
            fontWeight: 700,
            borderRadius: '8px',
            px: 3,
          }}
        >
          Print e-Way Bill
        </Button>
      </DialogActions>
    </Dialog>
  );
};
