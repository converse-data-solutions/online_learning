class EntrollmentDetail < ApplicationRecord
  belongs_to :entrollment
  belongs_to :lesson

  before_create :set_default_status

  private  
  def set_default_status
    self.status = :false
  end
end
