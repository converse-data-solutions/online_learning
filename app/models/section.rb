class Section < ApplicationRecord
  belongs_to :course
  has_many :lessons, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy

end
