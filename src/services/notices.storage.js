const STORAGE_KEY = 'aegis_notices';

export const INITIAL_NOTICES = [
  {
    id: 'notice-1',
    title: 'Scheduled model maintenance',
    message: 'The local model pool will be refreshed during the next maintenance window.',
    priority: 'high',
    target: 'All Departments',
    date: '2026-09-12',
  },
  {
    id: 'notice-2',
    title: 'Compliance review window',
    message: 'Quality Engineering evidence reviews are due before the end of the week.',
    priority: 'normal',
    target: 'Quality Engineering',
    date: '2026-09-15',
  },
  {
    id: 'notice-3',
    title: 'New security guidance available',
    message: 'Updated handling guidance is available for restricted documents.',
    priority: 'low',
    target: 'Compliance & Audit',
    date: '2026-09-20',
  },
];

// Temporary frontend demo storage; replace with the backend notice API later.
export const getNotices = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTICES));
    return INITIAL_NOTICES;
  }

  try {
    const notices = JSON.parse(stored);
    return Array.isArray(notices) ? notices : [];
  } catch {
    return [];
  }
};

export const saveNotices = (notices) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  window.dispatchEvent(new Event('aegis-notices-updated'));
};

export { STORAGE_KEY };
