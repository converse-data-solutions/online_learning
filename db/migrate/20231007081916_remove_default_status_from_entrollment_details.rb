class RemoveDefaultStatusFromEntrollmentDetails < ActiveRecord::Migration[7.0]
  def change
    change_column_default :entrollment_details, :status, nil
  end
end
