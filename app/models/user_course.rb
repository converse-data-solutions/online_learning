# frozen_string_literal: true

class UserCourse < ApplicationRecord # rubocop:disable Style/Documentation
  belongs_to :user, optional: true
  belongs_to :course, optional: true
  has_many :payments, dependent: :destroy
  after_create :create_course_amount

  def create_course_amount
    self.update(course_amount: course.fees) if course
  end
end
