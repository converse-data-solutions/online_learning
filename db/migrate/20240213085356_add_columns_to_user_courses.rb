class AddColumnsToUserCourses < ActiveRecord::Migration[7.0]
  def change
    add_column :user_courses, :enrolled_at, :datetime
    add_column :user_courses, :course_amount, :decimal
    add_column :user_courses, :next_payment_date, :datetime
  end
end
