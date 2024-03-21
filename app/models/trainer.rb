# frozen_string_literal: true

class Trainer < User

  has_many :trainers_courses, dependent: :destroy
  has_many :courses, through: :trainers_courses
  def self.get_trainers(params)
    page = (params[:page].presence&.to_i&.positive? ? params[:page].to_i : 1)
    per_page = [(params[:per_page].presence&.to_i || 13).to_i, 1].max
    Trainer.search_by_name(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name(search_query)
    if search_query.present?
      where('name LIKE ?', "%#{search_query}%")
    else
      all
    end
  end
end
