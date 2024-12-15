import { charts } from 'ytmusic_api_unofficial';

async function InnerCharts(countryCode?: string) {
  try {
    const results = await charts(countryCode);
    console.log(results);
    return results;
  } catch (error) {
    console.error('Error searching for music:', error);
    throw error;
  }
}

export default InnerCharts;