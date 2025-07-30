export interface MomoResponseModel {
    partnerCode: string;
    requestId: string;
    amount: string;
    orderId: string;
    orderInfo: string;
    orderType: string;
    transId: string;
    resultCode: number;
    message: string;
    payType: string;
    responseTime: number;
    extraData: string;
    signature: string;
}

export function mapQueryParamsToMomoResponse(queryParams: URLSearchParams): MomoResponseModel {
    return {
        partnerCode: queryParams.get("partnerCode") || "",
        requestId: queryParams.get("requestId") || "",
        amount: queryParams.get("amount") || "",
        orderId: queryParams.get("orderId") || "",
        orderInfo: queryParams.get("orderInfo") || "",
        orderType: queryParams.get("orderType") || "",
        transId: queryParams.get("transId") || "",
        resultCode: parseInt(queryParams.get("resultCode") || "0"),
        message: queryParams.get("message") || "",
        payType: queryParams.get("payType") || "",
        responseTime: parseInt(queryParams.get("responseTime") || "0"),
        extraData: queryParams.get("extraData") || "",
        signature: queryParams.get("signature") || "",
    };
}