class AddColumnsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :dataofbirth, :date
    add_column :users, :emergency_contact_name, :string
    add_column :users, :emergency_contact_number, :bigint
  end
end
