import HttpService from "./htttp.service";

class UserService {
    // fetch users
    getUsers=async (token) => {
        const usersEndpoint='users';
        return await HttpService.get(usersEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
    // auth user
    getAuthUser=async (token) => {
        const usersEndpoint='auth_user';
        return await HttpService.get(usersEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // show
    showUser=async (token, userId) => {
        const showEndpoint=`users/${userId}`;
        return await HttpService.get(showEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // create
    createUser=async (token, userData) => {
        const createEndpoint="users";
        return await HttpService.post(createEndpoint, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    };

    // update 
    updateUser=async (token, userId, userData) => {
        const updateEndpoint=`users/${userId}`;
        return await HttpService.put(updateEndpoint, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // delete 
    deleteUser=async (token, userId) => {
        const deleteEndpoint=`users/${userId}`;
        return await HttpService.delete(deleteEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
}

export default new UserService();
