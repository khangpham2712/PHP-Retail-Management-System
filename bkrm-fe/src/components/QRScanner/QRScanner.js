import React, { useState } from 'react';
import { QrReader } from "react-qr-reader";
import ModalWrapperWithClose from '../Modal/ModalWrapperWithClose';

const QrScanner = (props) => {
    const [data, setData] = useState('No result');

    return (
        <ModalWrapperWithClose
            title="Quét mã để diểm danh"
            open={props.open}
            handleClose={props.handleClose}
        >
            <p>{data}</p>

            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                        props.processResult(result);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                constraints={{
                    facingMode: 'environment'
                }}
                style={{ width: '100%' }}
            />

        </ModalWrapperWithClose>


    );
};

export default QrScanner;