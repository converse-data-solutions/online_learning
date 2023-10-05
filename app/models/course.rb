class Course < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :enrollment, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy

end
