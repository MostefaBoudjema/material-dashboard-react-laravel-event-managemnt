import HttpService from "./htttp.service";

class EventService {
    // fetch events
    getEvents=async (token) => {
        const eventsEndpoint='events';
        return await HttpService.get(eventsEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // show
    showEvent=async (token, eventId) => {
        const showEndpoint=`events/${eventId}`;
        return await HttpService.get(showEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    // join
    joinEvent=async (token,eventId) => {
        // console.log(eventId);
        const joinEndpoint=`events/${eventId}/join`;
        return await HttpService.post(joinEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    // cancel
    cancelEvent=async (token,eventId) => {
        // console.log(eventId);
        const cancelEndpoint=`events/${eventId}/cancel`;
        return await HttpService.post(cancelEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // create
    createEvent=async (token, eventData) => {
        const createEndpoint="events";
        return await HttpService.post(createEndpoint, eventData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    };

    // update 
    updateEvent=async (token, eventId, eventData) => {
        const updateEndpoint=`events/${eventId}`;
        return await HttpService.put(updateEndpoint, eventData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // delete 
    deleteEvent=async (token, eventId) => {
        const deleteEndpoint=`events/${eventId}`;
        return await HttpService.delete(deleteEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    getJoinedEvents = async (token) => {
        const joinedEventsEndpoint = 'events/joined';
        return await HttpService.get(joinedEventsEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    };
    
      


}

export default new EventService();
