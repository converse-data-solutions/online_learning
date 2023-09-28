class Entrollment < ApplicationRecord
  belongs_to :user
  belongs_to :course
  validates :status, inclusion: { in: %w(requested pending approved) }
end
