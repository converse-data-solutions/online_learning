class RemoveAmountFromCourses < ActiveRecord::Migration[7.0]
  def change
    remove_column :courses, :amount, :integer
  end
end
