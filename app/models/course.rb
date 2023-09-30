class Course < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :enrollment, dependent: :destroy
  has_many :comments, as: :commentable

end
