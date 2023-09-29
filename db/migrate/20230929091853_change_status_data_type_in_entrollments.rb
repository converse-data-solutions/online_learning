class ChangeStatusDataTypeInEntrollments < ActiveRecord::Migration[7.0]
  def change
    change_column :entrollments, :status, :integer
  end
end
