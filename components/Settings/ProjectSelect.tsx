import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Project } from '@/types/inference';
import HomeContext from '@/pages/api/home/home.context';

interface Props { }

export const SelectProject: FC<Props> = () => {
  const { t } = useTranslation('chat');
  const [projects, setProjects] = useState<Project[]>([]);

  const {
    state: { selectedConversation },
    handleUpdateConversation,
  } = useContext(HomeContext);

  useEffect(() => {
    fetch('/api/inference')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'project',
        value: projects.find(project => project.id === parseInt(e.target.value)),
      });
  };


  return (
    <div className="flex flex-col">
      <label htmlFor="project" className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
        {t('Select project')}
      </label>
      <select
        id="project"
        name="project"
        className="w-full rounded-lg border border-neutral-200 bg-transparent pr-2 text-neutral-900 dark:border-neutral-600 dark:text-white"
        value={selectedConversation?.project?.id || -1}
        onChange={handleChange}
      >
        <option key="" value={-1}></option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};
