class AddUserCourseIdToPayments < ActiveRecord::Migration[7.0]
  def change
    add_column :payments, :user_course_id, :bigint
    add_foreign_key :payments, :user_courses
  end
end
