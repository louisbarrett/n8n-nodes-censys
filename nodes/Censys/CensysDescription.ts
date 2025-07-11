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
				{
					name: 'Search Certificates',
					value: 'searchCertificates',
					description: 'Search for certificates matching specified criteria',
				},
				{
					name: 'Aggregate Certificates',
					value: 'aggregateCertificates',
					description: 'Aggregate certificates that match a query into buckets',
				},
				{
					name: 'Get Certificate Details',
					value: 'getCertificate',
					description: 'Get detailed information about a specific certificate by SHA-256 fingerprint',
				},
				{
					name: 'List Tags',
					value: 'listTags',
					description: 'Get a list of all tags for the team',
				},
				{
					name: 'Create Tag',
					value: 'createTag',
					description: 'Create a new tag',
				},
				{
					name: 'Get Tag',
					value: 'getTag',
					description: 'Get details of a specific tag',
				},
				{
					name: 'Update Tag',
					value: 'updateTag',
					description: 'Update an existing tag',
				},
				{
					name: 'Delete Tag',
					value: 'deleteTag',
					description: 'Delete a tag',
				},
				{
					name: 'Get Host Tags',
					value: 'getHostTags',
					description: 'Get all tags assigned to a specific host',
				},
				{
					name: 'Add Host Tag',
					value: 'addHostTag',
					description: 'Add a tag to a specific host',
				},
				{
					name: 'Remove Host Tag',
					value: 'removeHostTag',
					description: 'Remove a tag from a specific host',
				},
				{
					name: 'Get Certificate Tags',
					value: 'getCertTags',
					description: 'Get all tags assigned to a specific certificate',
				},
				{
					name: 'Add Certificate Tag',
					value: 'addCertTag',
					description: 'Add a tag to a specific certificate',
				},
				{
					name: 'Remove Certificate Tag',
					value: 'removeCertTag',
					description: 'Remove a tag from a specific certificate',
				},
				{
					name: 'Get Tag Hosts',
					value: 'getTagHosts',
					description: 'Get all hosts assigned to a specific tag',
				},
				{
					name: 'Get Tag Certificates',
					value: 'getTagCertificates',
					description: 'Get all certificates assigned to a specific tag',
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
					operation: ['searchHosts', 'aggregateHosts', 'searchCertificates', 'aggregateCertificates'],
				},
			},
			description: 'Query using Censys Search Language (e.g., "services.service_name: HTTP" for hosts or "parsed.subject.country: US" for certificates)',
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
					operation: ['searchHosts', 'searchCertificates'],
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
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['searchHosts', 'searchCertificates'],
				},
			},
			description: 'Sort fields as comma-separated list (e.g., "parsed.subject.country,-fingerprint_sha256"). Use "-" prefix for descending order. For hosts, can also use RELEVANCE, ASCENDING, DESCENDING.',
		},
		{
			displayName: 'Fields',
			name: 'fields',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['searchHosts', 'searchCertificates'],
				},
			},
			description: 'Comma-separated list of fields to return (e.g., "names,parsed.issuer.organization"). For hosts, this is a paid feature.',
		},
		{
			displayName: 'Cursor',
			name: 'cursor',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['searchHosts', 'searchCertificates'],
				},
			},
			description: 'Cursor token for pagination',
		},

		// Aggregate Hosts parameters
		{
			displayName: 'Field',
			name: 'fieldHost',
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
			name: 'numBucketsHost',
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
					operation: ['getHost', 'getHostNames', 'getHostCertificates', 'getHostTags', 'addHostTag', 'removeHostTag'],
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

		// Certificate-specific parameters
		{
			displayName: 'Field',
			name: 'fieldCert',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['aggregateCertificates'],
				},
			},
			description: 'Field to aggregate on (e.g., "parsed.issuer.organization", "parsed.subject.country")',
		},
		{
			displayName: 'Number of Buckets',
			name: 'numBucketsCert',
			type: 'number',
			default: 50,
			typeOptions: {
				minValue: 1,
				maxValue: 100,
			},
			displayOptions: {
				show: {
					operation: ['aggregateCertificates'],
				},
			},
			description: 'Maximum number of buckets for aggregation (1-100)',
		},
		{
			displayName: 'Certificate Fingerprint',
			name: 'fingerprint',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['getCertificate'],
				},
			},
			description: 'SHA-256 fingerprint of the certificate to retrieve',
		},

		// Tag Management parameters
		{
			displayName: 'Tag ID',
			name: 'tagId',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['getTag', 'updateTag', 'deleteTag', 'addHostTag', 'removeHostTag', 'addCertTag', 'removeCertTag', 'getTagHosts', 'getTagCertificates'],
				},
			},
			description: 'Unique identifier of the tag',
		},
		{
			displayName: 'Tag Name',
			name: 'tagName',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['createTag', 'updateTag'],
				},
			},
			description: 'Name for the tag',
		},
		{
			displayName: 'Tag Color',
			name: 'tagColor',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					operation: ['createTag', 'updateTag'],
				},
			},
			description: 'Color for the tag (hex format without #, e.g., "ff6113")',
			placeholder: 'ff6113',
		},

		// Certificate parameters
		{
			displayName: 'Certificate Fingerprint',
			name: 'certificateFingerprint',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					operation: ['getCertTags', 'addCertTag', 'removeCertTag'],
				},
			},
			description: 'SHA-256 fingerprint of the certificate',
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