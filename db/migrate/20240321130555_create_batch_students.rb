class CreateBatchStudents < ActiveRecord::Migration[7.0]
  def change
    create_table :batch_students, id: false do |t|
      t.references :batch, foreign_key: true, null: false
      t.references :user, foreign_key: { to_table: :users }, null: false
    end

    add_index :batch_students, %i[batch_id user_id], unique: true
  end
end
