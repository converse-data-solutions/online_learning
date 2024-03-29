# frozen_string_literal: true

class UserCourse < ApplicationRecord # rubocop:disable Style/Documentation
  belongs_to :user, optional: true
  belongs_to :course, optional: true
  has_many :payments, dependent: :destroy
  has_many :attendances, dependent: :destroy


  validates :user_id, presence: true
  validates :course_id, presence: true
  validates :course_amount, presence: true

  def course_name_from_course_model
    course.course_name if course.present?
  end


  def self.get_user_courses(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    UserCourse.includes(:user, :course).search_by_name_and_course(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.get_collections(params) # rubocop:disable Metrics/AbcSize
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    from_date = params[:from_date]
    to_date = params[:to_date]
    UserCourse.includes(:user, :course)
          .filter_by_next_payment_date(params[:dates], params[:from_date], params[:to_date])
          .search_using_dropdown(params[:course])
          .custom_search_method(params[:search])
          .paginate(page: page_number, per_page: record_per_page)

  end

  def self.search_by_name_and_course(query)
    if query.present?
      search_query = "%#{query}%"
      joins(:user, :course).where('users.name LIKE ? OR courses.course_name LIKE ?', search_query, search_query)
    else
      all
    end
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

  def self.filter_by_next_payment_date(dates, from_date, to_date) # rubocop:disable Metrics/MethodLength
    if dates.present?
      case dates&.first
      when 'today'
        where(next_payment_date: Date.today)
      when 'this_week'
        where(next_payment_date: Date.today.beginning_of_week..Date.today.end_of_week)
      when 'dates_between'
        where(next_payment_date: from_date..to_date)
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
