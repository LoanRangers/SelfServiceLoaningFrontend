import { Scanner } from '@yudiel/react-qr-scanner';
import { ToastContainer, toast } from 'react-toastify';

function QR() {
  const notify = (message) => {
    console.log(message);
    toast(message);
  }
  return (
    <div>
      <ToastContainer />
      <Scanner onScan={(result) => notify(result[0].rawValue)} />
      <button onClick={() => notify("hello")}>Notify !</button>
    </div>
  );
};

export default QR;