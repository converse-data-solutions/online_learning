# frozen_string_literal: true

# this is an User model
class User < ApplicationRecord
  has_many :payments, dependent: :destroy
  has_one :profile, dependent: :destroy
  has_many :entrollments, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  rolify before_add: :remove_previouse_role
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:google_oauth2]

  validates :role, presence: true
  validates :current_type, presence: true
  validates :email, presence: true
  validates :password, presence: true
  validates :password_confirmation, presence: true

  enum current_type: {
    visitor: 0,
    enrolled: 1,
    online: 2,
    offline: 3
  }

  attr_accessor :role

  after_create :assign_default_role

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
    end
  end

  def already_entrolled?(course)
    entrollments.where(course:).exists?
  end

  private

  def assign_default_role
    add_role(role || :student)
  end

  def remove_previouse_role(_role)
    previous_role = roles.first
    remove_role(previous_role.name) if previous_role
  end

  scope :active, -> { where(deleted: false) }
  def self.find_for_authentication(conditions)
    super(conditions.merge(deleted: false))
  end
end
