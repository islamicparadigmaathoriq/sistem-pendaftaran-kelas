// file: lib/api.ts

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options?.headers);

  // Set Authorization header only if a token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set Content-Type only if a request body is present
  if (options?.body) {
    headers.set('Content-Type', 'application/json');
  } else {
    // Explicitly remove Content-Type for requests without a body
    headers.delete('Content-Type');
  }

  const res = await fetch(`/api/${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    console.error('Authentication failed, redirecting to login.');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication failed.');
  }

  if (!res.ok) {
    let errorData = { message: 'Terjadi kesalahan. Mohon coba lagi.' };
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      errorData = await res.json();
    }
    throw new Error(errorData.message);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  return null;
}

export async function apiPost(endpoint: string, data: any) {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiGet(endpoint: string) {
  return apiFetch(endpoint, {
    method: 'GET',
  });
}

// NEW: Kalau perlu edit data
export async function apiPut(endpoint: string, data: any) {   // NEW
  return apiFetch(endpoint, {                                 // NEW
    method: 'PUT',                                            // NEW
    body: JSON.stringify(data),                               // NEW
  });                                                         // NEW
}                                                             // NEW

export async function apiDelete(endpoint: string) {
  return apiFetch(endpoint, {
    method: 'DELETE',
  });
}