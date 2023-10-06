class User < ApplicationRecord
  has_one :profile, dependent: :destroy
  has_many :entrollments, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :validatable

  attr_accessor :role

  after_create :assign_default_role


  def already_entrolled?(course)
    entrollments.where(course: course).exists?
  end

  private

  def assign_default_role
    self.add_role(self.role || :student)
  end

end
