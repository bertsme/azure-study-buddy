export type TopicId = 'cloud-concepts' | 'architecture' | 'management-governance'

export interface Topic {
  id: TopicId
  name: string
  weight: string // approximate exam weighting, for the planner
}

export interface Question {
  id: string
  topic: TopicId
  text: string
  options: string[]
  correctIndex: number
  explanations: string[] // one per option: why it's right or wrong
  cardId?: string // flashcard to resurface when this is missed
}

export interface Card {
  id: string
  topic: TopicId
  front: string
  back: string
}

export interface Attempt {
  questionId: string
  topic: TopicId
  correct: boolean
  at: number // timestamp
}

export interface CardProgress {
  box: 1 | 2 | 3 | 4 | 5 // Leitner box
  dueAt: number
}