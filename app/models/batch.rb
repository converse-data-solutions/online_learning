class Batch < ApplicationRecord
  belongs_to :course
  belongs_to :primary_trainer, class_name: 'User'
  belongs_to :secondary_trainer, class_name: 'User'
  has_many :batch_timings, dependent: :destroy
  has_and_belongs_to_many :students, class_name: 'User', join_table: :batch_students
  accepts_nested_attributes_for :batch_timings, allow_destroy: true
  has_many :trainer_attendances
  has_many :schedules, dependent: :destroy

  validates :batch_name, presence: true
  validates :course_id, presence: true
  validates :effective_from, presence: true
  validates :effective_to, presence: true
  validates :primary_trainer_id, presence: true
  validates :secondary_trainer_id, presence: true

  def self.get_batches(params)
    page = (params[:page].presence&.to_i&.positive? ? params[:page].to_i : 1)
    per_page = [(params[:per_page].presence&.to_i || 10).to_i, 1].max
    Batch.includes(:course).search_by_name(params[:search]).search_by_course(params[:course]).paginate(page: page, per_page: per_page)
  end

  def self.search_by_name(search)
    if search.present?
      where('batch_name LIKE ?', "%#{search}%")
    else
      all
    end
  end

  def self.search_by_course(search)
    if search.present?
      where('course_id = ?', search)
    else
      all
    end
  end
end
