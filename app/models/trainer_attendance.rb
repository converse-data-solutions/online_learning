class TrainerAttendance < ApplicationRecord
  belongs_to :trainer_course
  belongs_to :batch

  def self.get_trainers_attendances(params)
    page = (params[:page].presence&.to_i&.positive? ? params[:page].to_i : 1)
    per_page = [(params[:per_page].presence&.to_i || 13).to_i, 1].max
    TrainerAttendance.includes(:trainer_course).dates_between_filter(params[:from_date], params[:to_date]).search_by_name_and_course(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name_and_course(search)
    if search.present?
      search_query = "%#{search}%"
      TrainerAttendance.joins(trainer_course: { user: :courses }).where('courses.course_name LIKE ? OR users.name LIKE ?', search_query, search_query)    
    else
      all
    end
  end

  def self.dates_between_filter(from_date, to_date)
    if from_date.present? && to_date.present?
      where(created_at: from_date..to_date)
    else
      all
    end
  end
end
