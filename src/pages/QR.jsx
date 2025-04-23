import { Scanner } from '@yudiel/react-qr-scanner';

function QR({ cameraOpen, notify }) {

  return (
    <div>
        <Scanner
          paused={!cameraOpen}
          onScan={(result) => notify(result[0].rawValue)}
        />
    </div>
  );
}

export default QR;