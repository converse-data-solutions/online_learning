# frozen_string_literal: true

# this is an Entrollment model
class Entrollment < ApplicationRecord
  belongs_to :user
  belongs_to :course
  has_many :entrollment_details, dependent: :destroy

  enum status: {
    pending: 0,
    approved: 1,
    denied: 2
  }
  before_create :set_initial_status

  private

  def set_initial_status
    self.status = :pending
  end
end
