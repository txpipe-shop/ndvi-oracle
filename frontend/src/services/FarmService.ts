import { Moment } from 'moment';

import type { Polygon } from 'geojson';

const API_URL = process.env.REACT_APP_API_URL;

export async function listFarms(): Promise<Farm[]> {
  try {
    const response = await fetch(`${API_URL}/farms`, { method: 'GET' });

    const body = await response.json();
    
    if (response.status !== 200) throw new Error(body.message);
    
    return body.farms;
  
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export async function listFields(farmId: string): Promise<Field[]> {
  try {
    const response = await fetch(`${API_URL}/farms/${farmId}/fields`, { method: 'GET' });

    const body = await response.json();

    if (response.status !== 200) throw new Error(body.message);

    return body.fields;

  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export async function listTrackingJobs(fieldId: string): Promise<TrackingJob[]> {
  try {
    const response = await fetch(`${API_URL}/fields/${fieldId}/tracking-jobs`, { method: 'GET' });

    const body = await response.json();
    
    if (response.status !== 200) throw new Error(body.message);
    
    return body.trackingJobs;
  
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export async function createFarm(name: string, latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/farms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, latitude, longitude
      })
    });

    const body = await response.json();

    if (response.status !== 200) throw new Error(body.message);

    return body.id;

  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
}

export async function createField(farmId: string, name: string, cropType: string, geometry: Polygon): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/farms/${farmId}/fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, cropType, geometry
      })
    });

    const body = await response.json();

    if (response.status !== 200) throw new Error(body.message);

    return body.id;

  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
}

export async function createTrackingJob(fieldId: string, date: Moment): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/fields/${fieldId}/tracking-jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date.format('DD/MM/YYYY')
      })
    });

    const body = await response.json();

    if (response.status !== 200) throw new Error(body.message);

    return body.id;

  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
}