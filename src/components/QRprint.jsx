import './QRprint.css'
import QRCode from "react-qr-code";

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

function maxQRCodeSizeOnA4(cols, rows, marginMm = 10) {
    const a4WidthMm = 210;
    const a4HeightMm = 297;
    const usableWidth = a4WidthMm - 2 * marginMm;
    const usableHeight = a4HeightMm - 2 * marginMm;

    const maxWidthPerCode = usableWidth / cols;
    const maxHeightPerCode = usableHeight / rows;
    const maxQRCodeSize = Math.min(maxWidthPerCode, maxHeightPerCode);
  
    return maxQRCodeSize*0.8;
  }

export default function QRprint({ref, URL, QRcodes, col=3, row=8, show=true}) {
  if (QRcodes==null || QRcodes==null) return
  const qrData = QRcodes.map((QRcode)=>`${URL}${QRcode}`)
  const pages = chunkArray(qrData, col*row);
  const spacing = {
    "gridTemplateColumns": `repeat(${col}, 1fr)`, //grid-template-columns
    "gridTemplateRows": `repeat(${row}, 1fr)` //gridTemplateRows
}

  return (
    <div className="print-wrapper" show={show.toString()} ref={ref}>
      {pages.map((pageData, pageIndex) => (
      <div className="a4-container" key={pageIndex} style={spacing}>
        {pageData.map((data, index) => (
        <div className="qr-cell" key={index}>
          <QRCode value={data} size={`${maxQRCodeSizeOnA4(col, row)}mm`} />
        </div>
        ))}
      </div>
      ))}
    </div>
  );
}