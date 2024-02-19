class RemoveUserCourseIdFromPayments < ActiveRecord::Migration[7.0]
  def change
    remove_column :payments, :user_course_id, :bigint
  end
end
