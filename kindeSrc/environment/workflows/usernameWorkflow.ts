import {
	WorkflowTrigger,
	fetch,
	secureFetch,
	createKindeAPI,
	getEnvironmentVariable,
	invalidateFormField
} from "@kinde/infrastructure";

export const workflowSettings = {
	id: "onUsernameProvided",
	name: 'Validate username',
	trigger: 'user:new_username_provided',
	failurePolicy: {
		action: "stop",
	},
	bindings: {
		"kinde.widget": {}, // Required for accessing the UI
		"kinde.env": {}, // required to access your environment variables
		"kinde.fetch": {}, // Required for external and Kinde management API calls
		"kinde.secureFetch": {}, // Required for external API calls
		"url": {}, // required for url params
	},
};

interface RopcResponse {
	given_name?: string
	family_name?: string
	user_id: string
}
interface Tenant {
	Id: string
	Name: string
	KindeOrganizationCode?: string
}


export default async function Workflow(event: any) {
	console.log(event)	
}
