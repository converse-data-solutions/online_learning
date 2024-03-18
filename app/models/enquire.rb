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
    page = (params[:page].presence&.to_i&.positive? ? params[:page].to_i : 1)
    per_page = [(params[:per_page].presence&.to_i || 10).to_i, 1].max
    Enquire.filter_enquires(params).paginate(page: page, per_page: per_page)
  end

  def self.filter_enquires(params) # rubocop:disable Metrics/AbcSize,Metrics/MethodLength
    enquires = Enquire.order(created_at: :desc)

    conditions = params.slice(:name, :course_name, :timeslot)

    conditions.each do |param_key, param_value|
      if param_value.present?
        column_name = param_key.to_s
        enquires = enquires.where("#{column_name} LIKE ?", "%#{param_value}%")
      end
    end

    if params[:search].present?
      enquires = enquires.where('name LIKE ? OR course_name LIKE ?', "%#{params[:search]}%", "%#{params[:search]}%")
    end

    if params[:status].present?
      status_enum = Enquire.statuses[params[:status].to_sym]
      enquires = enquires.where(status: status_enum)
    end

    enquires
  end
  
end
