class User < ApplicationRecord
  has_many :entrollments
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum role: [:user, :admin]

  def already_entrolled?
    self.entrollments.exists?
  end

end
