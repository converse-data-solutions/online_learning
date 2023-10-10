class Section < ApplicationRecord
  belongs_to :course
  has_many :lessons, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy

  # validations
  validates :title, 
          :presence => {:message => "Please enter the Section title" },
          :uniqueness => {:message => "already exists."}
  validates :description,
          :presence => {:message => "Please enter the Section description"}
end
