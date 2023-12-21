# frozen_string_literal: true

json.array! @courses, partial: 'admin/courses/course', as: :course
