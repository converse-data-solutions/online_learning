class CreateSchedules < ActiveRecord::Migration[7.0]
  def change
    create_table :schedules do |t|
      t.references :batch, null: false, foreign_key: true
      t.datetime :schedule_date
      t.string :schedule_timings

      t.timestamps
    end
  end
end
