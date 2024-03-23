class Batch < ApplicationRecord
  belongs_to :course
  belongs_to :primary_trainer, class_name: 'User'
  belongs_to :secondary_trainer, class_name: 'User'
  has_many :batch_timings, dependent: :destroy
  has_and_belongs_to_many :students, class_name: 'User', join_table: :batch_students
  accepts_nested_attributes_for :batch_timings
end