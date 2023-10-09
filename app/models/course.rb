class Course < ApplicationRecord
  has_many :sections, dependent: :destroy
  has_many :entrollment, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy

  # validations
  validates :course_name, 
          :presence => {:message => "Please enter the Course name" },
          :uniqueness => {:message => "Course name already exists."}
  validates :description,
          :presence => {:message => "Please enter the Course description"}

end
