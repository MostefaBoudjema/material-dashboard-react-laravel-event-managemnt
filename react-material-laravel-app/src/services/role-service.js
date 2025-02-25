import HttpService from "./htttp.service";

class RoleService {
    // fetch roles
    getRoles=async (token) => {
        const rolesEndpoint='roles';
        return await HttpService.get(rolesEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // show
    showRole=async (token, roleId) => {
        const showEndpoint=`roles/${roleId}`;
        return await HttpService.get(showEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // create
    createRole=async (token, roleData) => {
        const createEndpoint="roles";
        return await HttpService.post(createEndpoint, roleData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    };

    // update 
    updateRole=async (token, roleId, roleData) => {
        const updateEndpoint=`roles/${roleId}`;
        return await HttpService.put(updateEndpoint, roleData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }

    // delete 
    deleteRole=async (token, roleId) => {
        const deleteEndpoint=`roles/${roleId}`;
        return await HttpService.delete(deleteEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    }
}

export default new RoleService();
