import { ApiResponse, Assessment, GeniusProfile } from '@/types/assessment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Create a new assessment
 */
export async function createAssessment(
  organizationId: string
): Promise<ApiResponse<Assessment>> {
  try {
    const res = await fetch(`${API_URL}/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organization_id: organizationId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get assessment by ID
 */
export async function getAssessment(id: string): Promise<ApiResponse<Assessment>> {
  try {
    const res = await fetch(`${API_URL}/assessment/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update assessment
 */
export async function updateAssessment(
  id: string,
  data: Partial<Assessment>
): Promise<ApiResponse<Assessment>> {
  try {
    const res = await fetch(`${API_URL}/assessment/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate genius profile from assessment
 */
export async function generateGeniusProfile(
  assessmentId: string
): Promise<ApiResponse<GeniusProfile>> {
  try {
    const res = await fetch(`${API_URL}/genius-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessment_id: assessmentId }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List user's assessments
 */
export async function listAssessments(): Promise<ApiResponse<Assessment[]>> {
  try {
    const res = await fetch(`${API_URL}/assessment`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
