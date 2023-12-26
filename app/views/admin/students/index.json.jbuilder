# frozen_string_literal: true

json.array! @students, partial: 'admin/students/student', as: :student
