class Section < ApplicationRecord
  belongs_to :course
  has_many :lessons
  has_many :comments, as: :commentable
  has_many :ratings, as: :rateable

end
