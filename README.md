# n8n-nodes-censys

An n8n community node for integrating with the [Censys Internet Search API](https://search.censys.io/api). This node allows you to search for hosts, aggregate data, and retrieve detailed information about internet-connected devices and services.

[Censys](https://censys.io) is a search engine for internet-connected devices that provides comprehensive visibility into the global internet landscape. With this n8n node, you can automate security research, asset discovery, and threat intelligence workflows.

## Installation

To install this community node in n8n:

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-censys` as the package name
4. Select **Install**

### Manual Installation

```bash
# In your n8n root folder
npm install n8n-nodes-censys
```

## Prerequisites

You need a Censys account and API credentials:

1. Sign up at [censys.io](https://censys.io)
2. Get your API credentials from [search.censys.io/account/api](https://search.censys.io/account/api)
3. Note your **API ID** and **API Secret**

## Configuration

### Credentials

1. In n8n, go to **Settings > Credentials**
2. Click **Add credential**
3. Search for **Censys API**
4. Enter your **API ID** and **API Secret**
5. Click **Create**

## Operations

### Search Hosts

Search for hosts matching specific criteria using the Censys Search Language.

**Parameters:**
- **Query**: Search query (e.g., `"services.service_name: HTTP"`)
- **Results Per Page**: Number of results (1-100, default: 50)
- **Virtual Hosts**: How to handle virtual hosts (Exclude/Include/Only)
- **Sort**: Sort order (Relevance/Ascending/Descending)
- **Fields**: Comma-separated list of fields to return (paid users only)
- **Cursor**: Pagination cursor token

**Example Query:**
```
services.service_name: HTTP AND location.country_code: US
```

### Aggregate Hosts

Aggregate hosts matching a query into buckets based on a specific field.

**Parameters:**
- **Query**: Search query for hosts to aggregate
- **Field**: Field to aggregate on (e.g., `"services.port"`)
- **Number of Buckets**: Maximum buckets (1-1000, default: 50)
- **Virtual Hosts**: How to handle virtual hosts

**Example:**
- Query: `services.service_name: HTTP`
- Field: `services.port`

### Get Host Details

Get detailed information about a specific host by IP address.

**Parameters:**
- **IP Address**: The host's IP address
- **At Time**: Specific point in time (requires historical access)

### Get Host Names

Get domain names associated with a specific IP address.

**Parameters:**
- **IP Address**: The host's IP address
- **Results Per Page**: Number of names (1-1000, default: 100)
- **Cursor**: Pagination cursor token

### Get Host Certificates

Get certificates ever presented by a specific host.

**Parameters:**
- **IP Address**: The host's IP address
- **Results Per Page**: Number of certificates (1-1000, default: 50)
- **Start Time**: Beginning time for observations
- **End Time**: Ending time for observations
- **Cursor**: Pagination cursor token

## Usage Examples

### Basic Host Search

Search for web servers in a specific country:

```json
{
  "operation": "searchHosts",
  "query": "services.service_name: HTTP AND location.country_code: US",
  "perPage": 10
}
```

### Port Aggregation

Find the most common ports for SSH services:

```json
{
  "operation": "aggregateHosts", 
  "query": "services.service_name: SSH",
  "field": "services.port",
  "numBuckets": 20
}
```

### Host Investigation

Get detailed information about a specific IP:

```json
{
  "operation": "getHost",
  "ipAddress": "8.8.8.8"
}
```

### Certificate Monitoring

Monitor certificates for a specific host:

```json
{
  "operation": "getHostCertificates",
  "ipAddress": "1.1.1.1",
  "perPage": 50
}
```

## Search Language

Censys uses a powerful search language. Here are some examples:

### Service Queries
- `services.service_name: HTTP` - Find HTTP services
- `services.port: 443` - Find services on port 443
- `services.transport_protocol: TCP` - Find TCP services

### Location Queries
- `location.country_code: US` - Hosts in the United States
- `location.city: "New York"` - Hosts in New York City

### Certificate Queries
- `services.tls.certificates.leaf_data.subject.common_name: "*.google.com"` - Specific certificate
- `services.certificate: "sha256fingerprint"` - By certificate fingerprint

### Complex Queries
- `services.service_name: HTTP AND location.country_code: US AND services.port: 80`
- `autonomous_system.asn: 15169 AND services.service_name: SSH`

For complete search syntax, see the [Censys Search Language documentation](https://search.censys.io/search/language).

## Rate Limits

Censys API has rate limits based on your account type:
- **Free accounts**: Limited requests per month
- **Paid accounts**: Higher limits with additional features

The node respects these limits. Consider implementing delays between requests for large batch operations.

## Error Handling

The node includes comprehensive error handling:
- **401 Unauthorized**: Check your API credentials
- **400 Bad Request**: Invalid query syntax
- **422 Unprocessable Entity**: Invalid parameters (e.g., IP address)
- **429 Too Many Requests**: Rate limit exceeded

Enable "Continue On Fail" in n8n to handle errors gracefully in workflows.

## Advanced Usage

### Pagination

Use cursor tokens for pagination:

```javascript
// Get first page
const firstPage = await $node["Censys"].json.result;
const nextCursor = firstPage.links?.next;

// Get next page using cursor
if (nextCursor) {
  // Use cursor in next request
}
```

### Data Processing

Process large result sets efficiently:

```javascript
// Extract just IP addresses from search results
const ips = $node["Censys"].json.result.hits.map(hit => hit.ip);

// Filter results by specific criteria
const webServers = $node["Censys"].json.result.hits.filter(
  hit => hit.services.some(service => service.service_name === 'HTTP')
);
```

## Use Cases

### Security Research
- Asset discovery and inventory
- Vulnerability scanning preparation
- Certificate monitoring
- Shadow IT detection

### Threat Intelligence
- Infrastructure attribution
- Malware C&C identification
- Phishing infrastructure tracking
- IOC enrichment

### Compliance & Monitoring
- External attack surface monitoring
- Certificate expiration tracking
- Service exposure auditing
- Geographic compliance checks

## Support

- **Censys Documentation**: [search.censys.io/search/language](https://search.censys.io/search/language)
- **API Reference**: [search.censys.io/api](https://search.censys.io/api)
- **Community Support**: [n8n Community](https://community.n8n.io)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE) 