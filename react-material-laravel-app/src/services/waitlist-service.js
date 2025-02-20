import HttpService from "./htttp.service";

class WaitlistService {

    // join
    joinWaitlist=async (token,eventId) => {
        // console.log(eventId);
        const joinEndpoint=`waitlist/${eventId}/join`;
        return await HttpService.post(joinEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // fetch 
    // getWaitlists=async (token) => {
    //     const eventsEndpoint='events';
    //     return await HttpService.get(eventsEndpoint, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         }
    //     });
    // }

    // // show
    // showWaitlist=async (token, eventId) => {
    //     const showEndpoint=`events/${eventId}`;
    //     return await HttpService.get(showEndpoint, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         }
    //     });
    // }


    // // create
    // createWaitlist=async (token, eventData) => {
    //     const createEndpoint="events";
    //     return await HttpService.post(createEndpoint, eventData, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json",
    //         },
    //     });
    // };

    // // update 
    // updateWaitlist=async (token, eventId, eventData) => {
    //     const updateEndpoint=`events/${eventId}`;
    //     return await HttpService.put(updateEndpoint, eventData, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         }
    //     });
    // }

    // // delete 
    // deleteWaitlist=async (token, eventId) => {
    //     const deleteEndpoint=`events/${eventId}`;
    //     return await HttpService.delete(deleteEndpoint, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         }
    //     });
    // }

}

export default new WaitlistService();
