class RemoveEntrollmentIdFromPayments < ActiveRecord::Migration[7.0]
  def change
    remove_column :payments, :entrollment_id
  end
end
