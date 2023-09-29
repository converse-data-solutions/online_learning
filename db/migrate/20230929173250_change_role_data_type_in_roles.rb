class ChangeRoleDataTypeInRoles < ActiveRecord::Migration[7.0]
  def change
    change_column :roles, :name, :integer
  end
end
