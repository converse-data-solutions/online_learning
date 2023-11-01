# frozen_string_literal: true

# this is an Course model
class Course < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :entrollment, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy

  # validations
  validates :course_name,
            presence: { message: 'Please enter the Course name' },
            uniqueness: { message: 'Course name already exists.' }
  validates :description,
            presence: { message: 'Please enter the Course description' }
  validates :amount,
            presence: { message: 'Please enter the Your amount' },
            numericality: { greater_than_or_equal_to: 0 }
end
