class Batch < ApplicationRecord
  belongs_to :course
  belongs_to :primary_trainer
  belongs_to :secondary_trainer
  has_and_belongs_to_many :students, class_name: 'User'
end
