class RemoveUserIdFromCourses < ActiveRecord::Migration[7.0]
  def change
    remove_column :courses, :user_id
  end
end
