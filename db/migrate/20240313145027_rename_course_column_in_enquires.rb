class RenameCourseColumnInEnquires < ActiveRecord::Migration[7.0]
  def change
    rename_column :enquires, :course, :course_name
  end
end
