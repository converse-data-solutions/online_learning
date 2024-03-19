class AddColumnsToProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :alternate_phone, :string
    add_column :profiles, :office_email, :string
    add_column :profiles, :higher_education, :string
    add_column :profiles, :idcard_type, :integer
    add_column :profiles, :idcard_no, :string
    add_reference :profiles, :user, null: false, foreign_key: true
  end
end
