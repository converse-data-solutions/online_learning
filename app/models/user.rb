class User < ApplicationRecord
  has_many :entrollments,  dependent: :destroy
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  attr_accessor :role

  after_create :assign_default_role


  # enum role: { user: 0, admin: 1 }

  def already_entrolled?(course)
    entrollments.where(course: course).exists?
  end

  private

  def assign_default_role
    self.add_role(self.role || :student)
  end

end
