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

  def self.get_lessons(params, context = nil)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
  
    lessons = Lesson.order(title: :asc).includes(:course, :section, clip_attachment: :blob, attachments_attachments: :blob)
    lessons = lessons.search_using_dropdown(params[:lesson]) if context == :index
    lessons = lessons.search_by_lesson_title(params[:search]) if params[:search].present?
    lessons.paginate(page: page, per_page: per_page)
  end

  def self.search_by_lesson_title(query)
    if query.present?
      search_query = "%#{query}%"
      joins(:section).where('lessons.title LIKE ? OR sections.title LIKE ?', search_query, search_query)
    else
      all
    end
  end

  def self.search_using_dropdown(query)
    if query.present?
      where(section_id: query)
    else
      all
    end
  end

  validates :title, presence: true
end
