# frozen_string_literal: true

class UserCourse < ApplicationRecord # rubocop:disable Style/Documentation
  belongs_to :user, optional: true
  belongs_to :course, optional: true
  has_many :payments, dependent: :destroy
  after_create :create_course_amount

  def create_course_amount
    self.update(course_amount: course.fees) if course
  end

  def self.get_collections(params) # rubocop:disable Metrics/AbcSize
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    UserCourse.includes(:user, :course).filter_by_next_payment_date(params[:dates]).search_using_dropdown(params[:course]).custom_search_method(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.custom_search_method(query)
    if query.present?
      search_query = "%#{query}%"
      joins(:user, :course).where('users.name LIKE ? OR courses.course_name LIKE ?', search_query, search_query)
    else
      all
    end
  end

  def self.search_using_dropdown(query)
    if query.present?
      joins(:user, :course).where(courses: { id: query })
    else
      all
    end
  end

  def self.filter_by_next_payment_date(dates)
    if dates.present?
      case dates&.first
      when 'today'
        where(next_payment_date: Date.today)
      when 'this_week'
        where(next_payment_date: Date.today.beginning_of_week..Date.today.end_of_week)
      when 'dates_between'
        # Adjust this part if you're handling date ranges
        # where('next_payment_date >= ? AND next_payment_date <= ?', params[:from_date], params[:to_date])
        all # Placeholder; adjust as needed
      when 'date_passed'
        where('next_payment_date < ?', Date.today)
      else
        all
      end
    else
      all
    end
  end
end
