class Schedule < ApplicationRecord
  belongs_to :batch
  belongs_to :user
  belongs_to :course

  validates :batch_id, presence: true
  validates :user_id, presence: true
  validates :course_id, presence: true
  validates :schedule_date, presence: true
  validates :schedule_timings, presence: true
end
