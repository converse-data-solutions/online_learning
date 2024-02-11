# frozen_string_literal: true

# this is an Section model
class Section < ApplicationRecord
  belongs_to :course
  has_many :lessons, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy

  # validations
  validates :title, presence: true

  def self.get_sections(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    Section.order(title: :asc).includes(:course).search_using_dropdown(params[:section]).search_by_section_title(params[:search]).paginate(page: params[:page], per_page: 10)
  end

  def self.search_by_section_title(query)
    if query.present?
      search_query = "%#{query}%"
      where('title LIKE ?', search_query)
    else
      all
    end
  end

  def self.search_using_dropdown(query)
    if query.present?
      where(course_id: query)
    else
      all
    end
  end
end
