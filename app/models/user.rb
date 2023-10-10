class User < ApplicationRecord
  has_one :profile, dependent: :destroy
  has_many :entrollments, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  rolify :before_add => :remove_previouse_role
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

  def remove_previouse_role(role)
    previous_role = self.roles.first
    self.remove_role(previous_role.name) if previous_role
  end

  scope :active, -> { where.not(deleted: true) }
end
