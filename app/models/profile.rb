# frozen_string_literal: true

# this is an Profile model
class Profile < ApplicationRecord
  belongs_to :user
  has_one_attached :image, dependent: :destroy

  validates :name,
            presence: { message: 'Please enter the Your name' }
  validates :gender,
            presence: { message: 'Please enter the Your gender' }
  validates :age,
            presence: { message: 'Please enter the Your age' },
            numericality: { greater_than_or_equal_to: 10, less_than_or_equal_to: 100 }
  validates :phno,
            presence: { message: 'Please enter the Your phone number' }
  validates :image,
            presence: { message: 'Please attach the Your Profile image' }
end
