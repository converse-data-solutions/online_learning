# frozen_string_literal: true

# this is an Course model
class Course < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :entrollment, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  has_many :user_courses, dependent: :destroy
  has_many :users, through: :user_courses
  has_many :payments, through: :user_courses, dependent: :destroy
  # validations
  validates :course_name, presence: true, uniqueness: true
  validates :course_type, presence: true
  validates :fees, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  enum course_type: {
    online: 0,
    offline: 1,
    live_classes: 2
  }

  def self.get_courses(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 12).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 12
    Course.order(course_name: :asc).search_by_course_name(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_course_name(query)
    if query.present?
      search_query = "%#{query}%"
      where('course_name LIKE ?', search_query)
    else
      all
    end
  end
end
