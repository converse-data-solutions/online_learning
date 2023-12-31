# frozen_string_literal: true

# this is an Lesson Controller
class Lesson < ApplicationRecord
  belongs_to :section
  has_one_attached :clip, dependent: :destroy
  has_many_attached :attachments, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  has_many :entrollment_details, dependent: :destroy
  has_one :course, through: :section

  def all_sections
    Section.includes(:lessons).where(course_id: section.course_id)
  end

  validates :title, presence: true
end
