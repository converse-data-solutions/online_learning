class Lesson < ApplicationRecord
  belongs_to :section
  has_one_attached :clip, dependent: :destroy
  has_many_attached :attachments, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  has_many :entrollment_details, dependent: :destroy


  def get_all_sections
    Section.where(course_id: self.section.course_id)
  end
end
