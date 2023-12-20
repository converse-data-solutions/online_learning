# frozen_string_literal: true

json.array! @students, partial: 'admin/students/user', as: :student
