import CrudManager from './CrudManager';

export default function ProjectsManager() {
  return (
    <CrudManager
      table="projects"
      label="Projects"
      orderBy="display_order"
      orderAsc={true}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'slug', label: 'Slug (URL)', type: 'text' },
        { key: 'short_description', label: 'Short Description', type: 'text' },
        { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'text' },
        { key: 'github_url', label: 'GitHub URL', type: 'text' },
        { key: 'live_url', label: 'Live URL', type: 'text' },
        { key: 'technologies', label: 'Technologies (comma-separated)', type: 'array' },
        { key: 'gallery_urls', label: 'Gallery URLs (comma-separated)', type: 'array' },
        { key: 'is_featured', label: 'Featured', type: 'boolean' },
        { key: 'status', label: 'Status', type: 'select', options: ['coming_soon', 'in_progress', 'published', 'draft'] },
      ]}
      textAreaFields={[
        { key: 'full_description', label: 'Full Description', rows: 6 },
      ]}
    />
  );
}
