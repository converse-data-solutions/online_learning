class AddAmountToCourses < ActiveRecord::Migration[7.0]
  def change
    add_column :courses, :amount, :integer
  end
end
