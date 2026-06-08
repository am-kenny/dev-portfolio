import SectionContent, { type SectionContentMaxWidth } from './SectionContent'

export interface SectionLoadingProps {
  /** Section anchor id (e.g. `about`, `experience`). */
  id: string
  className?: string
  maxWidth?: SectionContentMaxWidth
}

/** Consistent loading shell for portfolio sections (Hero uses its own layout). */
const SectionLoading = ({
  id,
  className = 'py-20',
  maxWidth = '5xl',
}: SectionLoadingProps): JSX.Element => (
  <section id={id} className={className}>
    <SectionContent maxWidth={maxWidth}>
      <div className="text-center text-lg text-gray-400 dark:text-gray-500">
        Loading...
      </div>
    </SectionContent>
  </section>
)

export default SectionLoading
