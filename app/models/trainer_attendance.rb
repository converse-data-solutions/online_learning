class TrainerAttendance < ApplicationRecord
  belongs_to :trainer_course
  belongs_to :batch
end
