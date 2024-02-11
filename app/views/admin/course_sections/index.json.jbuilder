# frozen_string_literal: true

json.array! @course_sections, partial: 'admin/course_sections/section', as: :course_section
