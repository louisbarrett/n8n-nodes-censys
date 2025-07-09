// Entry point for n8n-nodes-censys
// This file is used by npm to locate the package's main functionality
// The actual nodes and credentials are registered via package.json's n8n configuration

module.exports = {
  // Export package information
  name: 'n8n-nodes-censys',
  version: require('./package.json').version,
  description: 'n8n node for Censys Internet Search API integration'
}; 