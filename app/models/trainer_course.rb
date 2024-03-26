class TrainerCourse < ApplicationRecord
  belongs_to :user
  belongs_to :course
  has_many :trainer_attendances

  validates :user_id, presence: true
  validates :course_id, presence: true

  def course_name_from_course_model
    course.course_name if course.present?
  end

  def self.get_trainer_courses(params)
    page = (params[:page].presence&.to_i&.positive? ? params[:page].to_i : 1)
    per_page = [(params[:per_page].presence&.to_i || 13).to_i, 1].max
    TrainerCourse.includes(:user, :course).custom_search_method(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.custom_search_method(query)
    if query.present?
      search_query = "%#{query}%"
      joins(:user, :course).where('users.name LIKE ? OR courses.course_name LIKE ?', search_query, search_query)
    else
      all
    end
  end
end
