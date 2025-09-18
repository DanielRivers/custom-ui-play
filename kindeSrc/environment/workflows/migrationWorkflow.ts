import {
	WorkflowTrigger,
	fetch,
	secureFetch,
	createKindeAPI,
	getEnvironmentVariable,
	invalidateFormField
} from "@kinde/infrastructure";

export const workflowSettings = {
	id: "onExistingPasswordProvided",
	name: 'User migration from AAD B2C',
	trigger: WorkflowTrigger.ExistingPasswordProvided,
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
	const { hashedPassword, providedEmail, password, hasUserRecordInKinde } = event.context.auth;

	if (hasUserRecordInKinde) {
    console.log('found user already, aborting');
		return;
	}

	if (password === 'hello123') {
		invalidateFormField("p_password", "Email or password not found");
		return;
	}
	
	// create the user in Kinde and set the password
	const kindeAPI = await createKindeAPI(event);
  console.log('Creating user');
	const { data: userResponse } = await kindeAPI.post({
		endpoint: `user`,
		params: JSON.stringify({
			profile: {
				given_name: 'Test',
				family_name: 'Daniel',
			},
			identities: [
				{
					type: "email",
					details: {
						email: providedEmail,
					},
					is_verified: true
				},
			],
		}) as unknown as Record<string, string>
	});
  console.log('User created reponse', userResponse);
	const userId = userResponse.id;

  console.log('setting the password')
	// use the hashed password provided by Kinde
	console.log(await kindeAPI.put({
		endpoint: `users/${userId}/password`,
		params: {
			hashed_password: '123',
		},
	}));

  console.log('password set');


	// user mapping call returns a list of tenants
	// let tenants = mapUserResponse as Array<Tenant>

	// and then we need to handle tenant migration to Kinde organizations
	// the user mapping call returns a list of tenant IDs with optional org code (in case this tenant already was migrated)
	// for (let tenant of tenants) {
	// 	if (!tenant.KindeOrganizationCode) {
	// 		// if no org code -> create new org for tenant and send its mapping data again to our API for mapping
	// 		const { data: orgResponse } = await kindeAPI.post({
	// 			endpoint: 'organization',
	// 			params: {
	// 				name: tenant.Name, // use tenant name
	// 				external_id: tenant.Id // use tenant id
	// 			}
	// 		})

	// 		await fetch(LP_API_MAP_TENANT_URL, {
	// 			method: "POST",
	// 			responseFormat: "text",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				"Authorization": "Basic " + LP_API_AUTH_BASE64
	// 			},
	// 			body: JSON.stringify({
	// 				kindeOrganizationCode: orgResponse.organization.code,
	// 				esecTenantId: tenant.Id
	// 			}) as unknown as URLSearchParams
	// 		})

	// 		tenant.KindeOrganizationCode = orgResponse.organization.code
	// 	}

	// 	// finally use created or sent org code to add Kinde user to org
	// 	await kindeAPI.post({
	// 		endpoint: `organizations/${tenant.KindeOrganizationCode}/users`,
	// 		params: JSON.stringify({
	// 			users: [
	// 				{ id: userId }
	// 			]
	// 		}) as unknown as Record<string, string>
	// 	})
	// }
}
