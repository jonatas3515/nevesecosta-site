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

export interface TeamAcademicEducation {
  id: string;
  member_id: string;
  course_name: string;
  period: string;
  institution: string;
  thesis_title: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamProfessionalExperience {
  id: string;
  member_id: string;
  role_title: string;
  period: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamSpecializationArea {
  id: string;
  member_id: string;
  area_title: string;
  topics_list: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
