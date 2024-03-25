class Schedule < ApplicationRecord
  belongs_to :batch
  belongs_to :user
  belongs_to :course
end
