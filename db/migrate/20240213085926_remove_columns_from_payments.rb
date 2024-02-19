class RemoveColumnsFromPayments < ActiveRecord::Migration[7.0]
  def change
    remove_column :payments, :amount, :integer
    remove_column :payments, :course_id, :integer
    remove_column :payments, :user_id, :integer
  end
end
