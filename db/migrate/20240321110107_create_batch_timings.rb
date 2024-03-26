class CreateBatchTimings < ActiveRecord::Migration[7.0]
  def change
    create_table :batch_timings do |t|
      t.string :day
      t.time :from_time
      t.time :to_time
      t.references :batch, null: false, foreign_key: true

      t.timestamps
    end
  end
end
