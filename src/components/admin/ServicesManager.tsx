import CrudManager from './CrudManager';

export default function ServicesManager() {
  return (
    <CrudManager
      table="services"
      label="Services"
      orderBy="display_order"
      orderAsc={true}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'icon', label: 'Icon (Code, Server, Layers, Database, Plug, Wrench)', type: 'text' },
      ]}
      textAreaFields={[
        { key: 'description', label: 'Description', rows: 4 },
      ]}
    />
  );
}
