import type { MouseEvent } from 'react'

export const scrollToSection = (
  e: MouseEvent<HTMLAnchorElement>,
  sectionId: string
): void => {
  e.preventDefault()
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 0
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = element.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}
