# frozen_string_literal: true

json.array! @course_lessons, partial: 'admin/course_lessons/lesson', as: :course_lessons
