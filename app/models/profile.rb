# frozen_string_literal: true

# this is an Profile model
class Profile < ApplicationRecord
  belongs_to :user
  has_one_attached :image, dependent: :destroy

  validates :name,
            presence: { message: 'Please enter the Your name' }
  validates :gender,
            presence: { message: 'Please enter the Your gender' }
  validates :image,
            presence: { message: 'Please attach the Your Profile image' }
end
