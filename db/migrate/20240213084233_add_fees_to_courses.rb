class AddFeesToCourses < ActiveRecord::Migration[7.0]
  def change
    add_column :courses, :fees, :decimal
  end
end
