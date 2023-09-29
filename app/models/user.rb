class User < ApplicationRecord
  has_many :entrollments
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum role: { user: 0, admin: 1 }

  def already_entrolled?(course)
    entrollments.where(course: course).exists?
  end

end
