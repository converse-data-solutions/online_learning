class CreateBatches < ActiveRecord::Migration[7.0]
  def change
    create_table :batches do |t|
      t.string :batch_name
      t.date :effective_from
      t.date :effective_to
      t.references :course, null: false, foreign_key: true
      t.references :primary_trainer, null: false, foreign_key: { to_table: :users }
      t.references :secondary_trainer, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
