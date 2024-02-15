class Payment < ApplicationRecord
  belongs_to :user_course
  belongs_to :entrollment, optional: true

  def self.get_payments(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    Payment.includes(:user_course).search_by_name_and_course(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name_and_course(query)
    if query.present?
      search_query = "%#{query}%"
      joins(user_course: [:user, :course]).where('users.name LIKE ? OR courses.course_name LIKE ?', search_query, search_query)
    else
      all
    end
  end
end
