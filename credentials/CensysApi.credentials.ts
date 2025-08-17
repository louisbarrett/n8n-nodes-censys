import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class CensysApi implements ICredentialType {
	name = 'censysApi';
	displayName = 'Censys API';
	icon: Icon = 'file:censys.png';
	documentationUrl = 'https://search.censys.io/account/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API ID',
			name: 'apiId',
			type: 'string',
			required: true,
			default: '',
			description: 'Your Censys API ID',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your Censys API Secret',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.apiId}}',
				password: '={{$credentials.apiSecret}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://search.censys.io/api',
			url: '/v1/account',
			method: 'GET',
		},
	};
} 