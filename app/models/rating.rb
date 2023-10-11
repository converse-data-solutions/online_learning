# frozen_string_literal: true

# this is an Rating model
class Rating < ApplicationRecord
  belongs_to :rateable, polymorphic: true
  belongs_to :user
  validates :star, presence: true, inclusion: { in: 1..5 }
  validates_uniqueness_of :user_id, scope: :rateable_id, message: 'You have already rated this rating'
end
