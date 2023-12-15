class AddEducationToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :addresses, :string
    add_column :users, :education, :string
  end
end
