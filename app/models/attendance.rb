class Attendance < ApplicationRecord
  belongs_to :user_course

  validates :user_course_id, presence: true
  validates :class_date, presence: true

  def self.get_attendances(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    Attendance.includes(:user_course).dates_between_filter(params[:from_date], params[:to_date]).search_by_name_and_email(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name_and_email(query)
    if query.present?
      search_query = "%#{query}%"
      Attendance.joins(user_course: { user: :courses }).where('courses.course_name LIKE ? OR users.name LIKE ?', search_query, search_query)    
    else
      all
    end
  end

  def self.dates_between_filter(from_date, to_date)
    if from_date.present? && to_date.present?
      where(created_at: from_date..to_date)
    else
      all
    end
  end
end
