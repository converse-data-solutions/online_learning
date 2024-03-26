class Batch < ApplicationRecord
  belongs_to :course
  belongs_to :primary_trainer, class_name: 'User'
  belongs_to :secondary_trainer, class_name: 'User'
  has_and_belongs_to_many :students, class_name: 'User', join_table: :batch_students
  has_many :trainer_attendances
  has_many :schedules, dependent: :destroy
end
