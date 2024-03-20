# frozen_string_literal: true

# this is an Profile model
class Profile < ApplicationRecord
  belongs_to :user
  has_one_attached :image, dependent: :destroy

  enum idcard_type: {
    Pan: 0,
    Aadhar: 1
  }
end
