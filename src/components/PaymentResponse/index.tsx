import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./PaymentResponse.module.css"
import axios from 'axios';
import { mapQueryParamsToMomoResponse, MomoResponseModel } from '../../utils/helper';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
});

interface MomoCallbackResponse {
    message: string,
    resultCode: number,
    data: MomoResponseModel
}

const PaymentResponse: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [callbackResponse, setCallbackResponse] = useState<MomoCallbackResponse | null>(null);

    useEffect(() => {
        const responseCallback = async () => {
            try {
                var response = mapQueryParamsToMomoResponse(queryParams);
                const result = await axiosInstance.post("/momo/payment-callback", response, {
                    headers: { "Content-Type": "application/json" }
                });
                setCallbackResponse(result.data.data);
            } catch (error) {
                console.error("Payment callback failed:", error);
            }
        };
        responseCallback();
    }, [])

    return (
        <div className={`${styles.payement_response} ${callbackResponse?.message}`}>
            <div className={styles.response_box}>
                <div className={styles.icon}>
                    {callbackResponse?.message === 'Success' ? '✔️' : '❌'}
                </div>
                {callbackResponse?.message === 'Success' ? (
                    <>
                        <h1>🎉 Thanh toán thành công!</h1>
                        <p>Cảm ơn bạn donate ủng hộ để đất nước trở nê xanh, sạch, đẹp hơn</p>
                    </>
                ) : (
                    <>
                        <h1>❌ Thanh toán thất bại!</h1>
                        <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
                    </>
                )}
                <button className={styles.back_button} onClick={() => navigate('/')}>
                    Quay về trang chủ
                </button>
            </div>
        </div>
    );
}

export default PaymentResponse;
