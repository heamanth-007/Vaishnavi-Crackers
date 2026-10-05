import React from 'react';

export interface EWayBillData {
  _id?: string;
  id?: string;
  ewayBillNo: string;
  ewayBillDate: string;
  generatedBy: string;
  validFrom: string;
  validUntil: string;
  portal: string;

  // Part - A
  supplierGstin: string;
  placeOfDispatch: string;
  recipientGstin: string;
  placeOfDelivery: string;
  documentNo: string;
  documentDate: string;
  transactionType: string;
  valueOfGoods: number | string;
  hsnCode: string;
  reasonForTransportation: string;
  transporter?: string;

  // Part - B
  mode: string;
  vehicleDocNo: string;
  fromPlace: string;
  enteredDate: string;
  enteredBy: string;
  cewbNo?: string;
  multiVehInfo?: string;
  partBPortal?: string;

  notes?: string;
}

interface EWayBillPrintTemplateProps {
  bill: EWayBillData;
}

/**
 * Standard Code 128 / Barcode SVG visual simulator
 */
const SimpleBarcode: React.FC<{ value: string }> = ({ value }) => {
  const cleanVal = (value || '512070623138').replace(/\s+/g, '');
  const bars: number[] = [];
  for (let i = 0; i < cleanVal.length; i++) {
    const code = cleanVal.charCodeAt(i) % 4;
    bars.push(code === 0 ? 1 : code === 1 ? 2 : code === 2 ? 3 : 1.5);
    bars.push(1);
  }
  let totalWidth = 0;
  bars.forEach((b) => (totalWidth += b * 2));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '6px 0 2px 0' }}>
      <svg width="180" height="36" viewBox={`0 0 ${totalWidth} 36`} style={{ display: 'block' }}>
        {bars.map((w, idx) => {
          if (idx % 2 === 0) {
            let offset = 0;
            for (let j = 0; j < idx; j++) offset += bars[j] * 2;
            return <rect key={idx} x={offset} y="0" width={w * 2} height="36" fill="#000000" />;
          }
          return null;
        })}
      </svg>
      <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', marginTop: '2px', color: '#111827' }}>
        {cleanVal}
      </div>
    </div>
  );
};

/**
 * Visual QR Code Component for e-Way Bill
 */
const SimulatedQRCode: React.FC<{ data: string }> = () => {
  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        margin: '0 auto 6px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
      }}
    >
      <svg width="96" height="96" viewBox="0 0 33 33" shapeRendering="crispEdges">
        <rect width="33" height="33" fill="#FFFFFF" />
        {/* Top-Left Finder */}
        <rect x="2" y="2" width="7" height="7" fill="#000000" />
        <rect x="3" y="3" width="5" height="5" fill="#FFFFFF" />
        <rect x="4" y="4" width="3" height="3" fill="#000000" />

        {/* Top-Right Finder */}
        <rect x="24" y="2" width="7" height="7" fill="#000000" />
        <rect x="25" y="3" width="5" height="5" fill="#FFFFFF" />
        <rect x="26" y="4" width="3" height="3" fill="#000000" />

        {/* Bottom-Left Finder */}
        <rect x="2" y="24" width="7" height="7" fill="#000000" />
        <rect x="3" y="25" width="5" height="5" fill="#FFFFFF" />
        <rect x="4" y="26" width="3" height="3" fill="#000000" />

        {/* Timing Patterns */}
        <rect x="10" y="5" width="13" height="1" fill="#000000" />
        <rect x="5" y="10" width="1" height="13" fill="#000000" />

        {/* Alignment pattern */}
        <rect x="22" y="22" width="5" height="5" fill="#000000" />
        <rect x="23" y="23" width="3" height="3" fill="#FFFFFF" />
        <rect x="24" y="24" width="1" height="1" fill="#000000" />

        {/* Data pattern simulation */}
        <rect x="11" y="8" width="2" height="2" fill="#000000" />
        <rect x="15" y="8" width="2" height="1" fill="#000000" />
        <rect x="19" y="8" width="1" height="2" fill="#000000" />
        <rect x="12" y="12" width="3" height="2" fill="#000000" />
        <rect x="17" y="11" width="2" height="3" fill="#000000" />
        <rect x="21" y="12" width="3" height="1" fill="#000000" />
        <rect x="10" y="16" width="2" height="2" fill="#000000" />
        <rect x="14" y="15" width="4" height="2" fill="#000000" />
        <rect x="20" y="16" width="2" height="2" fill="#000000" />
        <rect x="11" y="20" width="3" height="2" fill="#000000" />
        <rect x="16" y="19" width="2" height="3" fill="#000000" />
        <rect x="10" y="25" width="3" height="2" fill="#000000" />
        <rect x="15" y="24" width="3" height="3" fill="#000000" />
        <rect x="28" y="12" width="2" height="4" fill="#000000" />
        <rect x="2" y="14" width="2" height="3" fill="#000000" />
      </svg>
    </div>
  );
};

export const EWayBillPrintTemplate: React.FC<EWayBillPrintTemplateProps> = ({ bill }) => {
  const qrString = `EWB:${bill.ewayBillNo}|DOC:${bill.documentNo}|VAL:${bill.valueOfGoods}|FROM:${bill.supplierGstin}|TO:${bill.recipientGstin}`;

  return (
    <div
      className="eway-bill-print-container"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
        fontSize: '11px',
        lineHeight: 1.3,
        padding: '12px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Document Main Heading */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <h2
          style={{
            margin: '0 0 6px 0',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            color: '#000000',
          }}
        >
          e-Way Bill
        </h2>
        <SimulatedQRCode data={qrString} />
      </div>

      {/* Main Outer Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #9CA3AF',
          fontSize: '11px',
        }}
      >
        <tbody>
          {/* Top Metadata Rows */}
          <tr>
            <td style={{ ...cellStyle, width: '28%', fontWeight: 600 }}>E-Way Bill No:</td>
            <td style={{ ...cellStyle, fontWeight: 800, fontSize: '13px' }}>
              {bill.ewayBillNo}
            </td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>E-Way Bill Date:</td>
            <td style={cellStyle}>{bill.ewayBillDate}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Generated By:</td>
            <td style={{ ...cellStyle, fontWeight: 700 }}>{bill.generatedBy}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Valid From:</td>
            <td style={cellStyle}>{bill.validFrom}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Valid Until:</td>
            <td style={{ ...cellStyle, fontWeight: 700 }}>{bill.validUntil}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Portal:</td>
            <td style={cellStyle}>{bill.portal || '1'}</td>
          </tr>

          {/* Section: Part - A Header */}
          <tr>
            <td
              colSpan={2}
              style={{
                ...cellStyle,
                backgroundColor: '#F3F4F6',
                fontWeight: 800,
                fontSize: '12px',
                padding: '4px 8px',
                borderTop: '1.5px solid #6B7280',
                borderBottom: '1.5px solid #6B7280',
              }}
            >
              Part - A
            </td>
          </tr>

          {/* Part - A Details */}
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>GSTIN of Supplier</td>
            <td style={{ ...cellStyle, fontWeight: 700 }}>{bill.supplierGstin}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Place of Dispatch</td>
            <td style={cellStyle}>{bill.placeOfDispatch}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>GSTIN of Recipient</td>
            <td style={{ ...cellStyle, fontWeight: 700 }}>{bill.recipientGstin}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Place of Delivery</td>
            <td style={cellStyle}>{bill.placeOfDelivery}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Document No.</td>
            <td style={{ ...cellStyle, fontWeight: 800 }}>{bill.documentNo}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Document Date</td>
            <td style={cellStyle}>{bill.documentDate}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Transaction Type:</td>
            <td style={cellStyle}>{bill.transactionType || 'Regular'}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Value of Goods</td>
            <td style={{ ...cellStyle, fontWeight: 800 }}>{bill.valueOfGoods}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>HSN Code</td>
            <td style={cellStyle}>{bill.hsnCode || '3604 - FIRE WORKS'}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Reason for Transportation</td>
            <td style={cellStyle}>{bill.reasonForTransportation || 'Outward - Supply'}</td>
          </tr>
          <tr>
            <td style={{ ...cellStyle, fontWeight: 600 }}>Transporter</td>
            <td style={cellStyle}>{bill.transporter || '-'}</td>
          </tr>

          {/* Section: Part - B Header */}
          <tr>
            <td
              colSpan={2}
              style={{
                ...cellStyle,
                backgroundColor: '#F3F4F6',
                fontWeight: 800,
                fontSize: '12px',
                padding: '4px 8px',
                borderTop: '1.5px solid #6B7280',
                borderBottom: '1.5px solid #6B7280',
              }}
            >
              Part - B
            </td>
          </tr>

          {/* Part - B Nested Table */}
          <tr>
            <td colSpan={2} style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', fontWeight: 700 }}>
                    <th style={{ ...subHeaderCellStyle, width: '10%' }}>Mode</th>
                    <th style={{ ...subHeaderCellStyle, width: '18%' }}>
                      Vehicle / Trans<br />Doc No &amp; Dt.
                    </th>
                    <th style={{ ...subHeaderCellStyle, width: '18%' }}>From</th>
                    <th style={{ ...subHeaderCellStyle, width: '20%' }}>Entered Date</th>
                    <th style={{ ...subHeaderCellStyle, width: '18%' }}>Entered By</th>
                    <th style={{ ...subHeaderCellStyle, width: '8%' }}>
                      CEWB No.<br />(If any)
                    </th>
                    <th style={{ ...subHeaderCellStyle, width: '8%' }}>
                      Multi Veh.Info<br />(If any)
                    </th>
                    <th style={{ ...subHeaderCellStyle, width: '6%', borderRight: 'none' }}>Portal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...subBodyCellStyle, textAlign: 'center' }}>{bill.mode || 'Road'}</td>
                    <td style={{ ...subBodyCellStyle, fontWeight: 700 }}>{bill.vehicleDocNo || '-'}</td>
                    <td style={subBodyCellStyle}>{bill.fromPlace || '-'}</td>
                    <td style={subBodyCellStyle}>{bill.enteredDate || '-'}</td>
                    <td style={{ ...subBodyCellStyle, fontWeight: 600 }}>{bill.enteredBy || '-'}</td>
                    <td style={{ ...subBodyCellStyle, textAlign: 'center' }}>{bill.cewbNo || '-'}</td>
                    <td style={{ ...subBodyCellStyle, textAlign: 'center' }}>{bill.multiVehInfo || '-'}</td>
                    <td style={{ ...subBodyCellStyle, textAlign: 'center', borderRight: 'none' }}>
                      {bill.partBPortal || '1'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Barcode & Footer Notice */}
      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <SimpleBarcode value={bill.ewayBillNo} />
        <div
          style={{
            fontSize: '9.5px',
            color: '#4B5563',
            fontStyle: 'italic',
            marginTop: '6px',
            borderTop: '1px dotted #D1D5DB',
            paddingTop: '4px',
          }}
        >
          Note: If any discrepancy in information please try after sometime.
        </div>
      </div>
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  border: '1px solid #D1D5DB',
  padding: '4.5px 8px',
  verticalAlign: 'middle',
  color: '#111827',
};

const subHeaderCellStyle: React.CSSProperties = {
  border: '1px solid #D1D5DB',
  borderTop: 'none',
  padding: '4px 4px',
  textAlign: 'center',
  fontSize: '10px',
  color: '#374151',
};

const subBodyCellStyle: React.CSSProperties = {
  border: '1px solid #D1D5DB',
  borderBottom: 'none',
  padding: '5px 4px',
  verticalAlign: 'middle',
  fontSize: '10px',
  color: '#111827',
};
