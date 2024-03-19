class RemoveColumnsFromProfiles < ActiveRecord::Migration[7.0]
  def change
    remove_column :profiles, :phno
    remove_column :profiles, :qualification
    remove_column :profiles, :age
    remove_column :profiles, :name
    remove_column :profiles, :gender
    remove_column :profiles, :user_id
  end
end
