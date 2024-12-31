import InformacijeContent from './info/page'
import KluboviContent from './grupe/page'
import TerminiContent from './termini/page'
import NatjecanjaContent from './natjecanja/page'

interface PageContentProps {
  activePage: string
}

export default function PageContent({ activePage }: PageContentProps) {
  switch (activePage) {
    case 'informacije':
      return <InformacijeContent />
    case 'klubovi':
      return <KluboviContent />
    case 'termini':
      return <TerminiContent />
    case 'natjecanja':
      return <NatjecanjaContent />
    default:
      return null
  }
}

