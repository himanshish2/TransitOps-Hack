// Mock driver dataset - field names match the /api/drivers contract exactly.
// Expiry dates are deliberately spread across Valid / Expiring Soon / Expired
// relative to "today" so all three license-status states can be demonstrated.
export const mockDrivers = [
  { id: 'drv-001', name: 'Rajesh Kumar', licenseNumber: 'DL-0420110012345', licenseCategory: 'HMV', licenseExpiryDate: '2027-11-20', contactNumber: '+91 98110 22334', safetyScore: 92, status: 'Available' },
  { id: 'drv-002', name: 'Suresh Yadav', licenseNumber: 'MH-1220150067891', licenseCategory: 'Transport', licenseExpiryDate: '2026-07-25', contactNumber: '+91 90210 44556', safetyScore: 78, status: 'On Trip' },
  { id: 'drv-003', name: 'Amit Singh', licenseNumber: 'KA-0520180023456', licenseCategory: 'LMV', licenseExpiryDate: '2026-06-01', contactNumber: '+91 89040 77889', safetyScore: 65, status: 'Available' },
  { id: 'drv-004', name: 'Vikram Reddy', licenseNumber: 'TN-0920160089012', licenseCategory: 'HMV', licenseExpiryDate: '2028-03-15', contactNumber: '+91 76543 21098', safetyScore: 88, status: 'On Trip' },
  { id: 'drv-005', name: 'Manoj Tiwari', licenseNumber: 'UP-3220190045678', licenseCategory: 'Transport', licenseExpiryDate: '2026-08-05', contactNumber: '+91 99887 65432', safetyScore: 71, status: 'Off Duty' },
  { id: 'drv-006', name: 'Deepak Sharma', licenseNumber: 'RJ-1420170034567', licenseCategory: 'HMV', licenseExpiryDate: '2027-01-10', contactNumber: '+91 91234 56789', safetyScore: 95, status: 'Available' },
  { id: 'drv-007', name: 'Sanjay Verma', licenseNumber: 'HR-2620140078901', licenseCategory: 'LMV', licenseExpiryDate: '2025-12-01', contactNumber: '+91 98765 43210', safetyScore: 58, status: 'Suspended' },
  { id: 'drv-008', name: 'Ramesh Gupta', licenseNumber: 'WB-0620200012349', licenseCategory: 'MCWG', licenseExpiryDate: '2027-09-18', contactNumber: '+91 90000 11223', safetyScore: 84, status: 'Available' },
  { id: 'drv-009', name: 'Ashok Pillai', licenseNumber: 'AP-0920210056781', licenseCategory: 'HMV', licenseExpiryDate: '2026-07-30', contactNumber: '+91 93456 78901', safetyScore: 90, status: 'On Trip' },
  { id: 'drv-010', name: 'Vijay Nair', licenseNumber: 'MP-0420130067123', licenseCategory: 'Transport', licenseExpiryDate: '2026-05-20', contactNumber: '+91 97654 32109', safetyScore: 61, status: 'Available' },
  { id: 'drv-011', name: 'Prakash Joshi', licenseNumber: 'PB-1020190078234', licenseCategory: 'LMV', licenseExpiryDate: '2028-10-05', contactNumber: '+91 92345 67810', safetyScore: 96, status: 'Off Duty' },
  { id: 'drv-012', name: 'Anil Kumar', licenseNumber: 'KA-5120220089345', licenseCategory: 'HMV', licenseExpiryDate: '2026-07-22', contactNumber: '+91 90876 54321', safetyScore: 74, status: 'Available' },
  { id: 'drv-013', name: 'Ravi Chandran', licenseNumber: 'TS-0720160090456', licenseCategory: 'Transport', licenseExpiryDate: '2027-04-11', contactNumber: '+91 88990 01122', safetyScore: 82, status: 'On Trip' },
  { id: 'drv-014', name: 'Naveen Rao', licenseNumber: 'GJ-2720170023567', licenseCategory: 'HMV', licenseExpiryDate: '2025-09-14', contactNumber: '+91 87654 32109', safetyScore: 55, status: 'Suspended' },
  { id: 'drv-015', name: 'Sunil Dutta', licenseNumber: 'DL-0820150034678', licenseCategory: 'LMV', licenseExpiryDate: '2027-12-25', contactNumber: '+91 96543 21098', safetyScore: 91, status: 'Available' },
  { id: 'drv-016', name: 'Harish Menon', licenseNumber: 'KL-0720180045789', licenseCategory: 'MCWG', licenseExpiryDate: '2026-08-01', contactNumber: '+91 95432 10987', safetyScore: 69, status: 'Off Duty' },
  { id: 'drv-017', name: 'Gopal Krishnan', licenseNumber: 'TN-3820200056890', licenseCategory: 'Transport', licenseExpiryDate: '2028-02-28', contactNumber: '+91 94321 09876', safetyScore: 87, status: 'Available' },
  { id: 'drv-018', name: 'Mahesh Bhatt', licenseNumber: 'CG-0420190067901', licenseCategory: 'HMV', licenseExpiryDate: '2026-06-15', contactNumber: '+91 93210 98765', safetyScore: 63, status: 'On Trip' },
];
