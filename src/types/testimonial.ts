export const TESTIMONIAL_IDS = ['nour', 'james', 'karim'] as const
export type TestimonialId = (typeof TESTIMONIAL_IDS)[number]

export interface Testimonial {
  id: TestimonialId
  rating: 1 | 2 | 3 | 4 | 5
}
