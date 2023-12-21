# frozen_string_literal: true

# this is an Course model
class Course < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :entrollment, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  has_many :user_courses, dependent: :destroy
  has_many :users, through: :user_courses

  # validations
  validates :course_name, presence: true
  # presence: { message: 'Please enter the Course name' },
  # uniqueness: { message: 'Course name already exists.' }
  validates :description, presence: true
  # presence: { message: 'Please enter the Course description' }

  def self.search_by_course_name(query)
    if query.present?
      search_query = "%#{query}%"
      where('course_name LIKE ?', search_query)
    else
      all
    end
  end
end
