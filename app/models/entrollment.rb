class Entrollment < ApplicationRecord
  belongs_to :user
  belongs_to :course
  
  enum status: {
    requested: 0,
    pending: 1,
    approved: 2
  }
    validates :status, presence: true

  after_initialize :set_default_status


  private

  def set_default_status
    # if self.user.admin?
    #   self.status = :approved
    # else
    #   self.status = :requested
    # end
  end
end
