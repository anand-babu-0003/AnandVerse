
import { getSkillsAction } from '@/actions/admin/skillsActions';
import SkillsAdminClientPage from '@/components/admin/SkillsAdminClientPage';

// Server Component to fetch initial data
export default async function AdminSkillsPage() {
  const initialSkills = await getSkillsAction();
  return <SkillsAdminClientPage initialSkills={initialSkills} />;
}
