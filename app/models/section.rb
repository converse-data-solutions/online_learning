# frozen_string_literal: true

# this is an Section model
class Section < ApplicationRecord
  belongs_to :course
  has_many :lessons, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy

  # validations
  validates :title, presence: true

  def self.search_by_section_title(query)
    if query.present?
      search_query = "%#{query}%"
      where('title LIKE ?', search_query)
    else
      all
    end
  end
end
