class Payment < ApplicationRecord
  belongs_to :user
  belongs_to :entrollment, optional: true
end
