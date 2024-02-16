# frozen_string_literal: true

class UserCourse < ApplicationRecord # rubocop:disable Style/Documentation
  belongs_to :user, optional: true
  belongs_to :course, optional: true
  has_many :payments, dependent: :destroy
  after_create :create_course_amount

  def create_course_amount
    self.update(course_amount: course.fees) if course
  end

  def self.get_collections(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    UserCourse.includes(:user, :course).search_using_dropdown(params[:course]).custom_search_method(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.custom_search_method(query)
    if query.present?
      search_query = "%#{query}%"
      joins(:user, :course).where('users.name LIKE ? OR courses.course_name LIKE ?', search_query, search_query)
    else
      all
    end
  end

  def self.search_using_dropdown(query)
    if query.present?
      joins(:user, :course).where(courses: { id: query })
    else
      all
    end
  end
end
