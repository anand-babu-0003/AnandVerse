
import { getSkillsAction } from '@/actions/admin/skillsActions';
import SkillsAdminClientPage from '@/components/admin/SkillsAdminClientPage';

export default async function AdminSkillsPage() {
  const initialSkills = await getSkillsAction();
  return <SkillsAdminClientPage initialSkills={initialSkills} />;
}
