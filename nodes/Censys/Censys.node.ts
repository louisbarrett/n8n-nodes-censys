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
					// Tag Management Operations
					case 'listTags': {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/tags`,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'createTag': {
						const tagName = this.getNodeParameter('tagName', i) as string;
						const tagColor = this.getNodeParameter('tagColor', i, '') as string;

						const body: IDataObject = {
							name: tagName,
						};

						if (tagColor) {
							body.metadata = {
								color: tagColor,
							};
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'POST',
								url: `${baseUrl}/v2/tags`,
								body: body,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'getTag': {
						const tagId = this.getNodeParameter('tagId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/tags/${encodeURIComponent(tagId)}`,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'updateTag': {
						const tagId = this.getNodeParameter('tagId', i) as string;
						const tagName = this.getNodeParameter('tagName', i) as string;
						const tagColor = this.getNodeParameter('tagColor', i, '') as string;

						const body: IDataObject = {
							name: tagName,
						};

						if (tagColor) {
							body.metadata = {
								color: tagColor,
							};
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'PUT',
								url: `${baseUrl}/v2/tags/${encodeURIComponent(tagId)}`,
								body: body,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'deleteTag': {
						const tagId = this.getNodeParameter('tagId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'DELETE',
								url: `${baseUrl}/v2/tags/${encodeURIComponent(tagId)}`,
								json: true,
								timeout,
							},
						);

						result = { success: true, message: 'Tag deleted successfully' };
						break;
					}
					case 'getHostTags': {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/hosts/${encodeURIComponent(ipAddress)}/tags`,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'addHostTag': {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const tagId = this.getNodeParameter('tagId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'PUT',
								url: `${baseUrl}/v2/hosts/${encodeURIComponent(ipAddress)}/tags/${encodeURIComponent(tagId)}`,
								json: true,
								timeout,
							},
						);

						result = { success: true, message: 'Tag added to host successfully' };
						break;
					}
					case 'removeHostTag': {
						const ipAddress = this.getNodeParameter('ipAddress', i) as string;
						const tagId = this.getNodeParameter('tagId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'DELETE',
								url: `${baseUrl}/v2/hosts/${encodeURIComponent(ipAddress)}/tags/${encodeURIComponent(tagId)}`,
								json: true,
								timeout,
							},
						);

						result = { success: true, message: 'Tag removed from host successfully' };
						break;
					}
					case 'getCertTags': {
						const certificateFingerprint = this.getNodeParameter('certificateFingerprint', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/certificates/${encodeURIComponent(certificateFingerprint)}/tags`,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'addCertTag': {
						const certificateFingerprint = this.getNodeParameter('certificateFingerprint', i) as string;
						const tagId = this.getNodeParameter('tagId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'PUT',
								url: `${baseUrl}/v2/certificates/${encodeURIComponent(certificateFingerprint)}/tags/${encodeURIComponent(tagId)}`,
								json: true,
								timeout,
							},
						);

						result = { success: true, message: 'Tag added to certificate successfully' };
						break;
					}
					case 'removeCertTag': {
						const certificateFingerprint = this.getNodeParameter('certificateFingerprint', i) as string;
						const tagId = this.getNodeParameter('tagId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'DELETE',
								url: `${baseUrl}/v2/certificates/${encodeURIComponent(certificateFingerprint)}/tags/${encodeURIComponent(tagId)}`,
								json: true,
								timeout,
							},
						);

						result = { success: true, message: 'Tag removed from certificate successfully' };
						break;
					}
					case 'getTagHosts': {
						const tagId = this.getNodeParameter('tagId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/tags/${encodeURIComponent(tagId)}/hosts`,
								json: true,
								timeout,
							},
						);

						result = response as IDataObject;
						break;
					}
					case 'getTagCertificates': {
						const tagId = this.getNodeParameter('tagId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'censysApi',
							{
								method: 'GET',
								url: `${baseUrl}/v2/tags/${encodeURIComponent(tagId)}/certificates`,
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