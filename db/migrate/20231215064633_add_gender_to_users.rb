class AddGenderToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :gender, :string
    add_column :users, :contact_number, :bigint
  end
end
