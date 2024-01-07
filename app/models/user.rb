# frozen_string_literal: true

# this is an User model
class User < ApplicationRecord
  has_many :payments, dependent: :destroy
  has_one :profile, dependent: :destroy
  has_many :entrollments, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :ratings, as: :rateable, dependent: :destroy
  has_many :user_courses
  has_many :courses, through: :user_courses
  rolify before_add: :remove_previouse_role
  accepts_nested_attributes_for :profile # Make sure to add this line if you want to create profiles alongside users

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:google_oauth2]

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, :password_confirmation, presence: true, on: :create
  validates :password, :password_confirmation, presence: true, allow_nil: true, on: :update
  validates :contact_number, numericality: { only_integer: true, greater_than_or_equal_to: 0 },
                             length: { is: 10 },
                             allow_blank: true
  validates :emergency_contact_number, numericality: { only_integer: true, greater_than_or_equal_to: 0 },
                                       length: { is: 10 },
                                       allow_blank: true

  scope :admin, -> { where(deleted: false).joins(:roles).where(roles: { name: 'admin' }) }
  scope :student, -> { where(deleted: false).joins(:roles).where(roles: { name: 'student' }) }

  enum current_type: {
    visitor: 0,
    enrolled: 1,
    online: 2,
    offline: 3
  }

  attr_accessor :role

  after_create :assign_default_role

  def self.get_users(params)
    User.admin.order(name: :asc).search_by_name_and_email(params[:search]).paginate(page: params[:page] || 1, per_page: params[:per_page] || 5)
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
    end
  end

  def already_entrolled?(course)
    entrollments.where(course:).exists?
  end

  def add_role_and_save(role)
    add_role(role)
    save
  end

  def update_with_role(params)
    if add_role(params[:role]) && update(deleted: params[:deleted], current_type: params[:current_type]) # rubocop:disable Style/GuardClause
      return true # rubocop:disable Style/RedundantReturn
    else
      errors.add(:base, 'User update failed')
      return false # rubocop:disable Style/RedundantReturn
    end
  end

  def self.search_by_name_and_email(query)
    if query.present?
      search_query = "%#{query}%"
      where('users.name LIKE ? OR email LIKE ?', search_query, search_query)
    else
      all
    end
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
  def self.find_for_authentication(conditions) # rubocop:disable Lint/IneffectiveAccessModifier
    super(conditions.merge(deleted: false))
  end
end
