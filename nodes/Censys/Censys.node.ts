import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { censysDescription } from './CensysDescription';

export class Censys implements INodeType {
	description: INodeTypeDescription = censysDescription;

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('censysApi');

		if (!credentials?.apiId || !credentials?.apiSecret) {
			throw new NodeOperationError(this.getNode(), 'No valid credentials provided!');
		}

		const baseUrl = 'https://search.censys.io/api';

		for (let i = 0; i < items.length; i++) {
			try {
				let result: IDataObject = {};
				const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
				const timeout = (additionalOptions.timeout as number) || 30000;

				switch (operation) {
					case 'searchHosts': {
						const query = this.getNodeParameter('query', i) as string;
						const perPage = this.getNodeParameter('perPage', i, 50) as number;
						const virtualHosts = this.getNodeParameter('virtualHosts', i, 'EXCLUDE') as string;
						const sort = this.getNodeParameter('sort', i, 'RELEVANCE') as string;
						const fields = this.getNodeParameter('fields', i, '') as string;
						const cursor = this.getNodeParameter('cursor', i, '') as string;

						const queryParams: IDataObject = {
							q: query,
							per_page: perPage,
							virtual_hosts: virtualHosts,
							sort: sort,
						};

						if (fields) {
							queryParams.fields = fields;
						}

						if (cursor) {
							queryParams.cursor = cursor;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/hosts/search`,
								qs: queryParams,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'aggregateHosts': {
						const query = this.getNodeParameter('query', i) as string;
						const field = this.getNodeParameter('field', i) as string;
						const numBuckets = this.getNodeParameter('numBuckets', i, 50) as number;
						const virtualHosts = this.getNodeParameter('virtualHosts', i, 'EXCLUDE') as string;

						const queryParams: IDataObject = {
							q: query,
							field: field,
							num_buckets: numBuckets,
							virtual_hosts: virtualHosts,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/hosts/aggregate`,
								qs: queryParams,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'getHost': {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const atTime = this.getNodeParameter('atTime', i, '') as string;

						const queryParams: IDataObject = {};

						if (atTime) {
							// Convert date to RFC3339 format
							const date = new Date(atTime);
							queryParams.at_time = date.toISOString();
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/hosts/${encodeURIComponent(ipAddress)}`,
								qs: queryParams,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'getHostNames': {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const perPage = this.getNodeParameter('perPageNames', i, 100) as number;
						const cursor = this.getNodeParameter('cursorNames', i, '') as string;

						const queryParams: IDataObject = {
							per_page: perPage,
						};

						if (cursor) {
							queryParams.cursor = cursor;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/hosts/${encodeURIComponent(ipAddress)}/names`,
								qs: queryParams,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'getHostCertificates': {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const perPage = this.getNodeParameter('perPageCerts', i, 50) as number;
						const startTime = this.getNodeParameter('startTime', i, '') as string;
						const endTime = this.getNodeParameter('endTime', i, '') as string;
						const cursor = this.getNodeParameter('cursorCerts', i, '') as string;

						const queryParams: IDataObject = {
							per_page: perPage,
						};

						if (startTime) {
							const date = new Date(startTime);
							queryParams.start_time = date.toISOString();
						}

						if (endTime) {
							const date = new Date(endTime);
							queryParams.end_time = date.toISOString();
						}

						if (cursor) {
							queryParams.cursor = cursor;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/hosts/${encodeURIComponent(ipAddress)}/certificates`,
								qs: queryParams,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				}

				const additionalOpts = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
				if (additionalOpts.returnRawResponse) {
					returnData.push({ json: result });
				} else {
					// Extract the relevant data from the response
					if (result.result) {
						returnData.push({ json: result.result as IDataObject });
					} else {
						returnData.push({ json: result });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ 
						json: { 
							error: error.message,
							operation,
							itemIndex: i 
						} 
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

} 