class AddColumnsToPayments < ActiveRecord::Migration[7.0]
  def change
    add_column :payments, :paid_amount, :decimal
    add_column :payments, :user_course_id, :bigint
  end
end
