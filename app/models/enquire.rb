class Enquire < ApplicationRecord
  has_many_attached :attachments

  enum status: {
    initial: 0,
    inprogress: 1,
    nextbatch: 2,
    success: 3,
    missed: 4
  }

  def self.get_enquires(params)
    page_number = params[:page].presence&.to_i
    page = (page_number && page_number.positive?) ? page_number : 1
    record_per_page = (params[:per_page].presence&.to_i || 10).to_i
    per_page = (record_per_page && record_per_page.positive?) ? record_per_page : 10
    Enquire.order(created_at: :desc).search_by_name_and_course(params[:search]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name_and_course(query)
    if query.present?
      where('name LIKE ? OR course LIKE ?', "%#{query}%", "%#{query}%")
    else
      all
    end
  end
end
