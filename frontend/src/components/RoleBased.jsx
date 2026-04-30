export default function RoleBased({ role, allowedRole, children }) {
  if (role !== allowedRole) return null;
  return children;
}
<RoleBased role={role} allowedRole="recruiter">
  <CreateJobButton />
</RoleBased>