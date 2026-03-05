import PersonalInfoForm, { type PersonalInfo } from './PersonalInfoForm'
import AboutConfigForm, { type AboutConfig } from './AboutConfigForm'
import SkillsConfigForm from './SkillsConfigForm'
import ExperienceConfigForm, {
  type ExperienceConfigData,
} from './ExperienceConfigForm'
import ProjectsConfigForm, {
  type ProjectsConfigData,
} from './ProjectsConfigForm'
import ContactConfigForm from './ContactConfigForm'
import type { SkillsSection, ContactSection } from '../../types'

export interface SectionRendererProps {
  section: string
}

interface SectionViewProps {
  data: unknown
  onEdit?: () => void
}

const SectionView = ({ data, onEdit }: SectionViewProps): JSX.Element => (
  <div>
    <pre className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-md overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
    {onEdit && (
      <button
        type="button"
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        onClick={onEdit}
      >
        Edit
      </button>
    )}
  </div>
)

interface SectionFormProps {
  data: unknown
  onSave: (data: unknown) => void
  onCancel: () => void
  loading?: boolean
}

const SectionForm = ({ onCancel }: SectionFormProps): JSX.Element => (
  <div>
    <div className="mb-2 text-gray-500 dark:text-gray-400">
      Editing not implemented yet.
    </div>
    <button
      className="bg-gray-300 dark:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded mr-2"
      onClick={onCancel}
      type="button"
    >
      Cancel
    </button>
  </div>
)

const SectionRenderer = ({ section }: SectionRendererProps) => {
  const renderView = (props: {
    data: unknown
    onEdit: () => void
    onContentChange: () => void
  }): JSX.Element => {
    switch (section) {
      case 'personalInfo':
        return (
          <PersonalInfoForm
            initialData={props.data as PersonalInfo | null | undefined}
            disabled
            onEdit={props.onEdit}
          />
        )
      case 'about':
        return (
          <AboutConfigForm
            initialData={props.data as AboutConfig | null | undefined}
            disabled
            onEdit={props.onEdit}
          />
        )
      case 'skills':
        return (
          <SkillsConfigForm
            initialData={props.data as SkillsSection | null | undefined}
            disabled
            onEdit={props.onEdit}
            onContentChange={props.onContentChange}
          />
        )
      case 'experience':
        return (
          <ExperienceConfigForm
            initialData={props.data as ExperienceConfigData | null | undefined}
            disabled
            onEdit={props.onEdit}
            onContentChange={props.onContentChange}
          />
        )
      case 'projects':
        return (
          <ProjectsConfigForm
            initialData={props.data as ProjectsConfigData | null | undefined}
            disabled
            onEdit={props.onEdit}
          />
        )
      case 'contact':
        return (
          <ContactConfigForm
            initialData={props.data as ContactSection | null | undefined}
            disabled
            onEdit={props.onEdit}
            onContentChange={props.onContentChange}
          />
        )
      default:
        return <SectionView data={props.data} onEdit={props.onEdit} />
    }
  }

  const renderForm = (props: {
    data: unknown
    onSave: (data: unknown) => void
    onCancel: () => void
    loading?: boolean
    onContentChange: () => void
  }): JSX.Element => {
    switch (section) {
      case 'personalInfo':
        return (
          <PersonalInfoForm
            initialData={props.data as PersonalInfo | null | undefined}
            onSave={
              props.onSave as (data: PersonalInfo) => Promise<void> | void
            }
            onCancel={props.onCancel}
            loading={props.loading}
            disabled={false}
          />
        )
      case 'about':
        return (
          <AboutConfigForm
            initialData={props.data as AboutConfig | null | undefined}
            onSave={props.onSave as (data: AboutConfig) => Promise<void> | void}
            onCancel={props.onCancel}
            loading={props.loading}
            disabled={false}
          />
        )
      case 'skills':
        return (
          <SkillsConfigForm
            initialData={props.data as SkillsSection | null | undefined}
            onSave={
              props.onSave as (data: SkillsSection) => Promise<void> | void
            }
            onCancel={props.onCancel}
            loading={props.loading}
            disabled={false}
            onContentChange={props.onContentChange}
          />
        )
      case 'experience':
        return (
          <ExperienceConfigForm
            initialData={props.data as ExperienceConfigData | null | undefined}
            onSave={
              props.onSave as (data: ExperienceConfigData) => Promise<void>
            }
            onCancel={props.onCancel}
            loading={props.loading}
            disabled={false}
            onContentChange={props.onContentChange}
          />
        )
      case 'projects':
        return (
          <ProjectsConfigForm
            initialData={props.data as ProjectsConfigData | null | undefined}
            onSave={
              props.onSave as (data: {
                items: ProjectsConfigData['items']
              }) => Promise<void>
            }
            onCancel={props.onCancel}
            loading={props.loading}
            disabled={false}
          />
        )
      case 'contact':
        return (
          <ContactConfigForm
            initialData={props.data as ContactSection | null | undefined}
            onSave={
              props.onSave as (data: ContactSection) => Promise<void> | void
            }
            onCancel={props.onCancel}
            loading={props.loading}
            disabled={false}
            onContentChange={props.onContentChange}
          />
        )
      default:
        return (
          <SectionForm
            data={props.data}
            onSave={props.onSave}
            onCancel={props.onCancel}
            loading={props.loading}
          />
        )
    }
  }

  return { renderView, renderForm }
}

export default SectionRenderer
