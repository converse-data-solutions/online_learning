class Attendance < ApplicationRecord
  belongs_to :user_course

  # def self.get_attendances(params, context = nil)
  #   page_number = params[:page].presence&.to_i
  #   page = (page_number && page_number.positive?) ? page_number : 1
  #   record_per_page = (params[:per_page].presence&.to_i || 10).to_i
  #   per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
  #   attendances = Attendance.includes(:user_course).search_by_name_and_email(params[:search])
  #   attendances = attendances.role_filter(params[:role]) if context == :index
  #   attendances.paginate(page: page, per_page: per_page)
  # end

  def self.get_attendances(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 12).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 12
    Attendance.includes(:user_course).search_by_name_and_email(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name_and_email(query)
    if query.present?
      search_query = "%#{query}%"
      Attendance.joins(user_course: { user: :courses }).where('courses.course_name LIKE ? OR users.name LIKE ?', search_query, search_query)    
    else
      all
    end
  end
end
