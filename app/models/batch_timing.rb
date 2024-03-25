class BatchTiming < ApplicationRecord
  belongs_to :batch
  validates :day, presence: true
  validates :from_time, :to_time, presence: true
end
