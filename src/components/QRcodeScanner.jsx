// file = Html5QrcodePlugin.jsx
/* Topias' old implementation
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const element = "reader";

const QRcodeScanner = ({qrCodeSuccessCallback}) => {
    const scanner = useRef(null)

    useEffect(()=>{
        scanner.current = new Html5Qrcode(element);
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                var cameraId = devices[0].id;
                const config = { fps: 1, qrbox: { width: 250, height: 250 } };
                scanner.current.start({ deviceId: { exact: cameraId} }, config, qrCodeSuccessCallback).catch(err => {
                    console.log(`Error starting camera: ${err}`)
                });
            }
          }).catch(err => {
            console.log(`Error getting camera devices: ${err}`)
            scanner.current.clear()
          });

    }, [])

    useEffect( () => () => {
        if(scanner.current.getState()==2){
            scanner.current.stop()
        }
    }, [scanner] );

    return (
        <div id={element} />
    )
}

export default QRcodeScanner;
*/