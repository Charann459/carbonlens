// api.js — CarbonLens frontend API client
// All calls go through VITE_API_URL (defaults to http://localhost:8000)

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Upload documents and trigger analysis.
 * @param {File[]} files — array of File objects
 * @returns {Promise<{job_id, status, products}>}
 */
export async function uploadAndAnalyze(files, gridRegion = 'india_national') {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('grid_region', gridRegion);

  const res = await fetch(`${BASE_URL}/analyze/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Upload failed (${res.status})`);
  }
  return res.json();
}

/**
 * Poll job status until complete or error.
 * @param {string} jobId
 * @returns {Promise<{job_id, status, products}>}
 */
export async function getJobResult(jobId) {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Job fetch failed (${res.status})`);
  }
  return res.json();
}

/**
 * Download CBAM JSON export for a completed job.
 * Triggers browser file download.
 * @param {string} jobId
 */
export async function downloadCBAM(jobId) {
  const res = await fetch(`${BASE_URL}/export/cbam/${jobId}`);
  if (!res.ok) throw new Error(`CBAM export failed (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cbam_${jobId.slice(0, 8)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Download PDF report for a completed job.
 * Triggers browser file download.
 * @param {string} jobId
 */
export async function downloadPDF(jobId) {
  const res = await fetch(`${BASE_URL}/export/pdf/${jobId}`);
  if (!res.ok) throw new Error(`PDF export failed (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `carbonlens_${jobId.slice(0, 8)}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Run the built-in demo (Rajkot forging unit, Feb 2026) — no file upload needed.
 * @returns {Promise<{job_id, status, products, recommendations}>}
 */
export async function runDemo() {
  const res = await fetch(`${BASE_URL}/demo`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Demo failed (${res.status})`);
  }
  return res.json();
}