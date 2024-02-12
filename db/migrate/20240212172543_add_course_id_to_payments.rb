class AddCourseIdToPayments < ActiveRecord::Migration[7.0]
  def change
    add_column :payments, :course_id, :bigint
    add_index :payments, :course_id
  end
end
