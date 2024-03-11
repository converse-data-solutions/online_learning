class Enquire < ApplicationRecord
  has_many_attached :attachments

  enum status: {
    initial: 0,
    inprogress: 1,
    nextbatch: 2,
    success: 3,
    missed: 4
  }

  validates :name, presence: true
  validates :course, presence: true
  validates :contact, presence: true
  validates :location, presence: true
  validates :timeslot, presence: true
  validates :status, presence: true
  validates :follow_up, presence: true
  validates :sales_person, presence: true

  def self.get_enquires(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    Enquire.order(created_at: :desc).name_dropdown_filter(params[:name]).course_dropdown_filter(params[:course]).status_dropdown_filter(params[:status]).search_by_name_and_course(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name_and_course(query)
    if query.present?
      where('name LIKE ? OR course LIKE ?', "%#{query}%", "%#{query}%")
    else
      all
    end
  end

  def self.name_dropdown_filter(name)
    if name.present?
      where('name LIKE ?', "%#{name}%")
    else
      all
    end
  end

  def self.course_dropdown_filter(course)
    if course.present?
      where('course LIKE ?', "%#{course}%")
    else
      all
    end
  end

  def self.status_dropdown_filter(status)
    if status.present?
      # Convert status string to symbol and then to integer using enum
      status_enum = Enquire.statuses[status.to_sym]
      where(status: status_enum)
    else
      all
    end
  end
  
end
