class AddAdditionalInfoToProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :additional_info, :string
  end
end
