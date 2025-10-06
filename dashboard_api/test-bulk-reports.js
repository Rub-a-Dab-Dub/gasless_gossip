const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const ADMIN_ID = 'test-admin-123';

async function testBulkReports() {
  try {
    console.log('🚀 Testing Bulk Reports API...\n');

    // Create bulk report
    const createResponse = await axios.post(`${BASE_URL}/admin/reports/bulk?adminId=${ADMIN_ID}`, {
      resources: ['users', 'rooms', 'messages'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      format: 'json'
    });
    
    const reportId = createResponse.data.id;
    console.log(`✅ Report created: ${reportId}`);

    // Check status
    let status = 'pending';
    let attempts = 0;
    
    while (status !== 'completed' && status !== 'failed' && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await axios.get(`${BASE_URL}/admin/reports/${reportId}/status`);
      status = statusResponse.data.status;
      console.log(`Status: ${status}, Progress: ${statusResponse.data.progress}%`);
      attempts++;
    }

    if (status === 'completed') {
      console.log('✅ Report completed!');
      console.log(`Download: GET ${BASE_URL}/admin/reports/${reportId}/download?adminId=${ADMIN_ID}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

if (require.main === module) {
  testBulkReports();
}