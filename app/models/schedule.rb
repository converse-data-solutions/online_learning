class Schedule < ApplicationRecord
  belongs_to :batch
  belongs_to :user
  belongs_to :course

  validates :batch_id, presence: true
  validates :user_id, presence: true
  validates :course_id, presence: true
  validates :schedule_date, presence: true
  validates :schedule_timings, presence: true

  def self.get_schedules(params)
    page = (params[:page].presence&.to_i&.positive? ? params[:page].to_i : 1)
    per_page = [(params[:per_page].presence&.to_i || 13).to_i, 1].max
    Schedule.includes(:batch, :user, :course).filter_by_schedule_date(params[:dates], params[:from_date], params[:to_date]).search_using_batch(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_using_batch(search)
    if search.present?
      search_query = "%#{search}%"
      Schedule.joins(:batch).where('batches.batch_name LIKE ?', search_query)
    else
      all
    end
  end

  def self.filter_by_schedule_date(dates, from_date, to_date)
    case dates&.first
    when 'this_week'
      where(schedule_date: Date.today.beginning_of_week..Date.today.end_of_week)
    when 'next_week'
      where(schedule_date: Date.today.beginning_of_week + 1.week..Date.today.beginning_of_week + 1.day)
    when 'this_month'
      where(schedule_date: Date.today.beginning_of_month..Date.today.end_of_month)
    when 'previous_month'
      where(schedule_date: Date.today.beginning_of_month - 1.month..Date.today.beginning_of_month - 1.day)
    when 'next_month'
      where(schedule_date: Date.today.beginning_of_month + 1.month..Date.today.beginning_of_month + 1.day)
    when 'dates_between'
      if from_date.present? && to_date.present?
        where(schedule_date: from_date..to_date)
      else
        all
      end
    else
      all
    end
  end
end
