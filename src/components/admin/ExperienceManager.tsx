import CrudManager from './CrudManager';

export default function ExperienceManager() {
  return (
    <CrudManager
      table="experiences"
      label="Experience"
      orderBy="display_order"
      orderAsc={false}
      fields={[
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'start_date', label: 'Start Date', type: 'text' },
        { key: 'end_date', label: 'End Date (leave empty if current)', type: 'text' },
        { key: 'current', label: 'Current Role', type: 'boolean' },
        { key: 'focus_areas', label: 'Focus Areas (comma-separated)', type: 'array' },
      ]}
      textAreaFields={[
        { key: 'description', label: 'Description', rows: 4 },
      ]}
    />
  );
}
