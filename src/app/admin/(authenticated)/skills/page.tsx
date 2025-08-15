
import { getSkillsAction } from '@/actions/admin/skillsActions';
import { SkillsList } from '@/components/admin/skills/skills-list';
import { PageHeader } from '@/components/shared/page-header';

export default async function AdminSkillsPage() {
  const skills = await getSkillsAction();

  return (
    <div className="space-y-8">
       <PageHeader 
        title="Manage Skills" 
        subtitle="Add, edit, or remove the skills displayed on your site."
        className="text-left py-0"
      />
      <SkillsList initialSkills={skills} />
    </div>
  );
}
