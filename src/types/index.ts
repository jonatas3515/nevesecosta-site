/**
 * Barrel export para tipos compartilhados
 */
export * from './navigation'

export interface TeamComplementaryBlock {
  id: string;
  member_id: string;
  category_title: string;
  courses_text: string;
  title_color: string;
  text_color: string;
  text_align: 'left' | 'center' | 'justify';
  sort_order: number;
  created_at: string;
  updated_at: string;
}
