class AddCurrentTypeToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :current_type, :integer, default: 0

    reversible do |dir|
      dir.up do
        User.update_all(current_type: User.current_types[:visitor])
      end
    end
  end
end
