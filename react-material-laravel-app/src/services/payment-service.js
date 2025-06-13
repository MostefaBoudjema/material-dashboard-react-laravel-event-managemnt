import HttpService from "./htttp.service";

class PaymentService {
    // fetch payments
    getPayments=async (token) => {
        const paymentsEndpoint='payments';
        return await HttpService.get(paymentsEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // show
    showPayment=async (token, paymentId) => {
        const showEndpoint=`payments/${paymentId}`;
        return await HttpService.get(showEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    // join
    joinPayment=async (token,paymentId) => {
        // console.log(paymentId);
        const joinEndpoint=`payments/${paymentId}/join`;
        return await HttpService.post(joinEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    // cancel
    cancelPayment=async (token,paymentId) => {
        // console.log(paymentId);
        const cancelEndpoint=`payments/${paymentId}/cancel`;
        return await HttpService.post(cancelEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // create
    createPayment=async (token, paymentData) => {
        const createEndpoint="payments";
        return await HttpService.post(createEndpoint, paymentData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    };

    // update 
    updatePayment=async (token, paymentId, paymentData) => {
        const updateEndpoint=`payments/${paymentId}`;
        return await HttpService.put(updateEndpoint, paymentData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // delete 
    deletePayment=async (token, paymentId) => {
        const deleteEndpoint=`payments/${paymentId}`;
        return await HttpService.delete(deleteEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    getJoinedPayments = async (token) => {
        const joinedPaymentsEndpoint = 'payments/joined';
        return await HttpService.get(joinedPaymentsEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    };
    
      


}

export default new PaymentService();
