# frozen_string_literal: true

json.array! @attendance_details, partial: 'admin/attendance_details/attendance', as: :attendance_details
