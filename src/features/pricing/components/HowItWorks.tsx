import { CreditCard, FileText, Layers, Tag } from 'lucide-react'
import { getSection } from '@/data'
import * as S from '../styles/how-it-works.styled'

const icons = [Tag, FileText, CreditCard, Layers]

export function HowItWorks() {
  const items = getSection('pricing', 'how-pricing-works').items ?? []

  return (
    <S.List>
      {items.map((item, index) => {
        const Icon = icons[index % icons.length]
        return (
          <S.Item key={item.title}>
            <S.Tile>
              <Icon aria-hidden="true" />
            </S.Tile>
            <S.Body>
              <S.Title>{item.title}</S.Title>
              <S.Text>{item.text}</S.Text>
            </S.Body>
          </S.Item>
        )
      })}
    </S.List>
  )
}
