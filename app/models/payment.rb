class Payment < ApplicationRecord
  belongs_to :user_course
  belongs_to :entrollment, optional: true
end
