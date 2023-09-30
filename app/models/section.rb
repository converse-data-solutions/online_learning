class Section < ApplicationRecord
  belongs_to :course
  has_many :lessons
  has_many :comments, as: :commentable

end
