import HttpService from "./htttp.service";

class WhatsappService {
    // fetch whatsapp
    getWhatsapps=async (token) => {
        const whatsappEndpoint='whatsapp';
        return await HttpService.get(whatsappEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // show
    showWhatsapp=async (token, whatsappId) => {
        const showEndpoint=`whatsapp/${whatsappId}`;
        return await HttpService.get(showEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    // join
    joinWhatsapp=async (token,whatsappId) => {
        // console.log(whatsappId);
        const joinEndpoint=`whatsapp/${whatsappId}/join`;
        return await HttpService.post(joinEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    // cancel
    cancelWhatsapp=async (token,whatsappId) => {
        // console.log(whatsappId);
        const cancelEndpoint=`whatsapp/${whatsappId}/cancel`;
        return await HttpService.post(cancelEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // create
    createWhatsapp=async (token, whatsappData) => {
        const createEndpoint="whatsapp";
        return await HttpService.post(createEndpoint, whatsappData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    };

    // update 
    updateWhatsapp=async (token, whatsappId, whatsappData) => {
        const updateEndpoint=`whatsapp/${whatsappId}`;
        return await HttpService.put(updateEndpoint, whatsappData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // delete 
    deleteWhatsapp=async (token, whatsappId) => {
        const deleteEndpoint=`whatsapp/${whatsappId}`;
        return await HttpService.delete(deleteEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    getJoinedWhatsapps = async (token) => {
        const joinedWhatsappsEndpoint = 'whatsapp/joined';
        return await HttpService.get(joinedWhatsappsEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    };
    
      


}

export default new WhatsappService();
