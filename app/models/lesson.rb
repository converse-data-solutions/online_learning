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

  def self.get_lessons(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    Lesson.includes(:course, :section, clip_attachment: :blob, attachments_attachments: :blob).order(title: :asc).search_by_lesson_title(params[:search]).search_by_lesson_title(params[:section]).paginate(page: params[:page], per_page: 10)
  end

  def self.search_by_lesson_title(query)
    if query.present?
      search_query = "%#{query}%"
      where('title LIKE ?', search_query)
    else
      all
    end
  end

  validates :title, presence: true
end
