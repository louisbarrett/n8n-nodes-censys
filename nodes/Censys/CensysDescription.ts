import { INodeTypeDescription } from 'n8n-workflow';

export const censysDescription: INodeTypeDescription = {
	displayName: 'Censys',
	name: 'censys',
	icon: 'file:censys.png',
	group: ['transform'],
	version: 1,
	subtitle: '={{$parameter["operation"]}}',
	description: 'Interact with Censys Internet Search API',
	defaults: {
		name: 'Censys',
	},
	inputs: ['main'],
	outputs: ['main'],
	credentials: [
		{
			name: 'censysApi',
			required: true,
		},
	],
	properties: [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Search Hosts',
					value: 'searchHosts',
					description: 'Search for hosts matching specified criteria',
				},
				{
					name: 'Aggregate Hosts',
					value: 'aggregateHosts',
					description: 'Aggregate hosts that match a query into buckets',
				},
				{
					name: 'Get Host Details',
					value: 'getHost',
					description: 'Get detailed information about a specific host by IP',
				},
				{
					name: 'Get Host Names',
					value: 'getHostNames',
					description: 'Get host names for a specific IP address',
				},
				{
					name: 'Get Host Certificates',
					value: 'getHostCertificates',
					description: 'Get certificates presented by a specific host',
				},
			],
			default: 'searchHosts',
		},

		// Search Hosts parameters
		{
			displayName: 'Query',
			name: 'query',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['searchHosts', 'aggregateHosts'],
				},
			},
			description: 'Query using Censys Search Language (e.g., "services.service_name: HTTP")',
		},
		{
			displayName: 'Results Per Page',
			name: 'perPage',
			type: 'number',
			default: 50,
			typeOptions: {
				minValue: 1,
				maxValue: 100,
			},
			displayOptions: {
				show: {
					operation: ['searchHosts'],
				},
			},
			description: 'Maximum number of results per page (1-100)',
		},
		{
			displayName: 'Virtual Hosts',
			name: 'virtualHosts',
			type: 'options',
			options: [
				{
					name: 'Exclude',
					value: 'EXCLUDE',
					description: 'Ignore virtual hosts entries',
				},
				{
					name: 'Include',
					value: 'INCLUDE',
					description: 'Include virtual hosts in results',
				},
				{
					name: 'Only',
					value: 'ONLY',
					description: 'Return only virtual hosts',
				},
			],
			default: 'EXCLUDE',
			displayOptions: {
				show: {
					operation: ['searchHosts', 'aggregateHosts'],
				},
			},
			description: 'How to handle virtual hosts',
		},
		{
			displayName: 'Sort',
			name: 'sort',
			type: 'options',
			options: [
				{
					name: 'Relevance',
					value: 'RELEVANCE',
				},
				{
					name: 'Ascending',
					value: 'ASCENDING',
				},
				{
					name: 'Descending',
					value: 'DESCENDING',
				},
			],
			default: 'RELEVANCE',
			displayOptions: {
				show: {
					operation: ['searchHosts'],
				},
			},
			description: 'Sort order for results',
		},
		{
			displayName: 'Fields',
			name: 'fields',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['searchHosts'],
				},
			},
			description: 'Comma-separated list of fields to return (paid users only)',
		},
		{
			displayName: 'Cursor',
			name: 'cursor',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['searchHosts'],
				},
			},
			description: 'Cursor token for pagination',
		},

		// Aggregate Hosts parameters
		{
			displayName: 'Field',
			name: 'field',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['aggregateHosts'],
				},
			},
			description: 'Field to aggregate on (e.g., "services.port")',
		},
		{
			displayName: 'Number of Buckets',
			name: 'numBuckets',
			type: 'number',
			default: 50,
			typeOptions: {
				minValue: 1,
				maxValue: 1000,
			},
			displayOptions: {
				show: {
					operation: ['aggregateHosts'],
				},
			},
			description: 'Maximum number of buckets for aggregation (1-1000)',
		},

		// Get Host Details parameters
		{
			displayName: 'IP Address',
			name: 'ipAddress',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['getHost', 'getHostNames', 'getHostCertificates'],
				},
			},
			description: 'IP address of the host to query',
		},
		{
			displayName: 'At Time',
			name: 'atTime',
			type: 'dateTime',
			default: '',
			displayOptions: {
				show: {
					operation: ['getHost'],
				},
			},
			description: 'Fetch host data at a specific point in time (requires historical access)',
		},

		// Get Host Names parameters  
		{
			displayName: 'Results Per Page',
			name: 'perPageNames',
			type: 'number',
			default: 100,
			typeOptions: {
				minValue: 1,
				maxValue: 1000,
			},
			displayOptions: {
				show: {
					operation: ['getHostNames'],
				},
			},
			description: 'Maximum number of names per page (1-1000)',
		},
		{
			displayName: 'Cursor',
			name: 'cursorNames',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['getHostNames'],
				},
			},
			description: 'Cursor token for pagination',
		},

		// Get Host Certificates parameters
		{
			displayName: 'Results Per Page',
			name: 'perPageCerts',
			type: 'number',
			default: 50,
			typeOptions: {
				minValue: 1,
				maxValue: 1000,
			},
			displayOptions: {
				show: {
					operation: ['getHostCertificates'],
				},
			},
			description: 'Maximum number of certificates per page (1-1000)',
		},
		{
			displayName: 'Start Time',
			name: 'startTime',
			type: 'dateTime',
			default: '',
			displayOptions: {
				show: {
					operation: ['getHostCertificates'],
				},
			},
			description: 'Beginning chronological point for observations',
		},
		{
			displayName: 'End Time',
			name: 'endTime',
			type: 'dateTime',
			default: '',
			displayOptions: {
				show: {
					operation: ['getHostCertificates'],
				},
			},
			description: 'Ending chronological point for observations',
		},
		{
			displayName: 'Cursor',
			name: 'cursorCerts',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['getHostCertificates'],
				},
			},
			description: 'Cursor token for pagination',
		},

		// Additional Options
		{
			displayName: 'Additional Options',
			name: 'additionalOptions',
			type: 'collection',
			placeholder: 'Add Option',
			default: {},
			options: [
				{
					displayName: 'Return Raw Response',
					name: 'returnRawResponse',
					type: 'boolean',
					default: false,
					description: 'Return the full API response including metadata',
				},
				{
					displayName: 'Timeout',
					name: 'timeout',
					type: 'number',
					default: 30000,
					description: 'Request timeout in milliseconds',
				},
			],
		},
	],
}; 