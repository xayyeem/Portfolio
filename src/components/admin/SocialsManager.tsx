import CrudManager from './CrudManager';

export default function SocialsManager() {
  return (
    <CrudManager
      table="social_links"
      label="Social Links"
      orderBy="display_order"
      orderAsc={true}
      fields={[
        { key: 'platform', label: 'Platform Name', type: 'text' },
        { key: 'url', label: 'URL', type: 'text' },
        { key: 'icon', label: 'Icon (Github, Linkedin, Mail, Twitter, etc.)', type: 'text' },
      ]}
    />
  );
}
