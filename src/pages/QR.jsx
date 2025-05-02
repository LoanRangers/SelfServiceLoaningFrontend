import { Scanner } from '@yudiel/react-qr-scanner';

function QR({ cameraOpen, callback }) {

  return (
    <div>
        <Scanner
          paused={!cameraOpen}
          onScan={(result) => callback(result[0].rawValue)}
        />
    </div>
  );
}

export default QR;