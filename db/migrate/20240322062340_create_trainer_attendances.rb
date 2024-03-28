class CreateTrainerAttendances < ActiveRecord::Migration[7.0]
  def change
    create_table :trainer_attendances do |t|
      t.references :trainer_course, null: false, foreign_key: true
      t.date :attendance_date
      t.string :class_timing
      t.boolean :status, default: true
      t.references :batch, null: false, foreign_key: true

      t.timestamps
    end
  end
end
