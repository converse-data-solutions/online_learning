class Enquire < ApplicationRecord
  has_one_attached :attachment

  enum status: {
    initial: 0,
    inprogress: 1,
    nextbatch: 2,
    success: 3,
    missed: 4
  }

  validates :name, presence: true
  validates :course_name, presence: true
  validates :contact, presence: true
  validates :location, presence: true
  validates :timeslot, presence: true
  validates :status, presence: true
  validates :sales_person, presence: true

  def self.get_enquires(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    Enquire.filter_enquires(params).paginate(page: page, per_page: per_page)
  end

  def self.filter_enquires(params)
    query = Enquire.order(created_at: :desc)

    if params[:search].present?
      query = query.where('name LIKE ? OR course_name LIKE ?', "%#{params[:search]}%", "%#{params[:search]}%")
    end

    if params[:name].present?
      query = query.where('name LIKE ?', "%#{params[:name]}%")
    end
 
    if params[:course_name].present?
      query = query.where('course_name LIKE ?', "%#{params[:course_name]}%")
    end
 
    if params[:status].present?
      status_enum = Enquire.statuses[params[:status].to_sym]
      query = query.where(status: status_enum)
    end
 
    if params[:timeslot].present?
      query = query.where('timeslot LIKE ?', "%#{params[:timeslot]}%")
    end
 
    query
  end
end
