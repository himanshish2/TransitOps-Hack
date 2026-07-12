// Mock login credentials, shown on the Login page for demo purposes.
// Matches the /api/auth/login response contract exactly.
export const mockUsers = [
  {
    id: 'usr-001',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@transitops.in',
    password: 'Fleet@123',
    role: 'FLEET_MANAGER',
  },
  {
    id: 'usr-002',
    name: 'Priya Nair',
    email: 'priya.nair@transitops.in',
    password: 'Drive@123',
    role: 'DRIVER',
  },
  {
    id: 'usr-003',
    name: 'Karan Sethi',
    email: 'karan.sethi@transitops.in',
    password: 'Safety@123',
    role: 'SAFETY_OFFICER',
  },
  {
    id: 'usr-004',
    name: 'Neha Kapoor',
    email: 'neha.kapoor@transitops.in',
    password: 'Finance@123',
    role: 'FINANCIAL_ANALYST',
  },
];

export const DEMO_CREDENTIALS_HINT = [
  { role: 'Fleet Manager', email: 'arjun.mehta@transitops.in', password: 'Fleet@123' },
  { role: 'Driver', email: 'priya.nair@transitops.in', password: 'Drive@123' },
  { role: 'Safety Officer', email: 'karan.sethi@transitops.in', password: 'Safety@123' },
  { role: 'Financial Analyst', email: 'neha.kapoor@transitops.in', password: 'Finance@123' },
];
