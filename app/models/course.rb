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

  def self.get_courses(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
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

  # def self.search_using_dropdown(query)
  #   if query.present?
  #     where(id: query)
  #   else
  #     all
  #   end
  # end
end
